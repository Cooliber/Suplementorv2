/**
 * Template Engine for Component Generation
 * Handles dynamic template processing with variable substitution
 * Supports Polish localization and TypeScript integration
 */

export interface TemplateVariable {
	name: string;
	value: string;
	type?: "string" | "boolean" | "number" | "object";
}

export interface TemplateContext {
	componentName: string;
	componentType: string;
	description: string;
	author: string;
	features: string[];
	polishLocalization: boolean;
	accessibility: boolean;
	performance: boolean;
	variables: TemplateVariable[];
}

export class TemplateEngine {
	private variables: Map<string, string> = new Map();
	private polishChars = /[ąćęłńóśźż]/gi;
	private medicalTerms: Map<string, string> = new Map([
		["supplement", "suplement"],
		["vitamin", "witamina"],
		["mineral", "minerał"],
		["dosage", "dawkowanie"],
		["contraindication", "przeciwwskazanie"],
		["interaction", "interakcja"],
		["efficacy", "skuteczność"],
		["safety", "bezpieczeństwo"],
		["research", "badania"],
		["evidence", "dowody"],
	]);

	constructor(private context: TemplateContext) {
		this.initializeVariables();
	}

	private initializeVariables(): void {
		// Basic component variables
		this.variables.set("COMPONENT_NAME", this.context.componentName);
		this.variables.set(
			"COMPONENT_NAME_LOWER",
			this.context.componentName.toLowerCase(),
		);
		this.variables.set(
			"COMPONENT_NAME_KEBAB",
			this.kebabCase(this.context.componentName),
		);
		this.variables.set("COMPONENT_TYPE", this.context.componentType);
		this.variables.set("DESCRIPTION", this.context.description);
		this.variables.set("AUTHOR", this.context.author);

		// Polish localization variables
		this.variables.set(
			"POLISH_LOCALIZATION",
			this.context.polishLocalization.toString(),
		);
		this.variables.set(
			"USE_POLISH_HOOK",
			this.context.polishLocalization ? "usePolishLocalization" : "",
		);

		// Complex conditional variables
		this.variables.set(
			"HAS_POLISH_LOCALIZATION",
			this.context.polishLocalization
				? `import { usePolishLocalization } from '@/lib/hooks/use-polish-localization';`
				: "",
		);

		this.variables.set(
			"POLISH_HOOK_DECLARATION",
			this.context.polishLocalization
				? "  const { t } = usePolishLocalization();"
				: "",
		);

		this.variables.set(
			"COMPONENT_CONTENT",
			this.context.polishLocalization
				? `      {t('${this.context.componentName.toLowerCase()}.title', '${this.context.componentName} Component')}`
				: `      ${this.context.componentName} Component`,
		);

		this.variables.set(
			"POLISH_TEST_CONTENT",
			this.context.polishLocalization
				? `\n  it('renders Polish text correctly', () => {\n    render(<${this.context.componentName} />);\n    // Add Polish character validation tests\n  });\n\n  it('handles Polish localization', () => {\n    render(<${this.context.componentName} />);\n    // Add localization functionality tests\n  });`
				: "",
		);

		this.variables.set(
			"POLISH_STORY_CONTENT",
			this.context.polishLocalization
				? `\nexport const PolishVersion: Story = {\n  parameters: {\n    docs: {\n      description: {\n        story: 'Component with Polish localization enabled.',\n      },\n    },\n  },\n};`
				: "",
		);

		// Feature flags
		this.variables.set(
			"HAS_ACCESSIBILITY",
			this.context.accessibility.toString(),
		);
		this.variables.set("HAS_PERFORMANCE", this.context.performance.toString());

		// Date variables
		const now = new Date();
		this.variables.set("CURRENT_DATE", now.toISOString().split("T")[0]!);
		this.variables.set("CURRENT_YEAR", now.getFullYear().toString());

		// Custom variables
		this.context.variables.forEach((variable) => {
			this.variables.set(variable.name.toUpperCase(), variable.value);
		});
	}

	/**
	 * Process template content with variable substitution
	 */
	processTemplate(template: string): string {
		let processed = template;

		// Handle conditional expressions first (like ${HAS_POLISH_LOCALIZATION ? 'content' : 'fallback'})
		processed = this.processConditionalExpressions(processed);

		// Replace all variables
		for (const [key, value] of this.variables.entries()) {
			const regex = new RegExp(`\\$\\{${key}\\}`, "g");
			processed = processed.replace(regex, value);
		}

		// Handle Polish localization
		if (this.context.polishLocalization) {
			processed = this.addPolishLocalization(processed);
		}

		// Handle conditional blocks
		processed = this.processConditionals(processed);

		return processed;
	}

	/**
	 * Add Polish localization to template
	 */
	private addPolishLocalization(content: string): string {
		let localized = content;

		// Add Polish character validation
		localized = localized.replace(/text="([^"]*)"/g, (match, text) => {
			if (this.containsPolishChars(text)) {
				return `${match}\n  data-polish-chars="true"`;
			}
			return match;
		});

		// Add Polish medical terminology
		for (const [english, polish] of this.medicalTerms.entries()) {
			const regex = new RegExp(`\\b${english}\\b`, "gi");
			localized = localized.replace(regex, polish);
		}

		return localized;
	}

	/**
	 * Process conditional expressions like ${VAR ? 'content' : 'fallback'}
	 */
	private processConditionalExpressions(content: string): string {
		let processed = content;

		// Handle ternary expressions with backticks: ${VAR ? `content` : `fallback`}
		const backtickTernaryRegex =
			/\$\{([^}]+)\s\?\s`([^`]*)`\s*:\s*`([^`]*)`\}/g;
		processed = processed.replace(
			backtickTernaryRegex,
			(match, condition, trueValue, falseValue) => {
				const shouldInclude = this.evaluateCondition(condition.trim());
				return shouldInclude ? trueValue : falseValue;
			},
		);

		// Handle ternary expressions with single quotes: ${VAR ? 'content' : 'fallback'}
		const quoteTernaryRegex = /\$\{([^}]+)\s\?\s'([^']*)'\s*:\s*'([^']*)'\}/g;
		processed = processed.replace(
			quoteTernaryRegex,
			(match, condition, trueValue, falseValue) => {
				const shouldInclude = this.evaluateCondition(condition.trim());
				return shouldInclude ? trueValue : falseValue;
			},
		);

		// Handle simple variable expressions: ${VAR}
		const varRegex = /\$\{([^}]+)\}/g;
		processed = processed.replace(varRegex, (match, variable) => {
			// Don't replace if it's already been handled by ternary
			if (
				variable.includes(" ? ") &&
				(variable.includes(" : ") || variable.includes(": "))
			) {
				return match;
			}

			// Get the variable value
			const value = this.variables.get(variable);

			// Handle boolean-like variables that start with HAS_
			if (variable.startsWith("HAS_")) {
				return value && value !== "" ? value : "";
			}

			// Handle other variables
			return value || "";
		});

		return processed;
	}

	/**
	 * Process conditional template blocks
	 */
	private processConditionals(content: string): string {
		let processed = content;

		// Handle if statements
		const ifRegex = /\{\{#if ([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
		processed = processed.replace(ifRegex, (match, condition, blockContent) => {
			const shouldInclude = this.evaluateCondition(condition);
			return shouldInclude ? blockContent : "";
		});

		// Handle unless statements
		const unlessRegex = /\{\{#unless ([^}]+)\}\}([\s\S]*?)\{\{\/unless\}\}/g;
		processed = processed.replace(
			unlessRegex,
			(match, condition, blockContent) => {
				const shouldInclude = !this.evaluateCondition(condition);
				return shouldInclude ? blockContent : "";
			},
		);

		return processed;
	}

	/**
	 * Evaluate conditional expressions
	 */
	private evaluateCondition(condition: string): boolean {
		// Simple variable check
		if (condition.startsWith("HAS_")) {
			return this.variables.get(condition) === "true";
		}

		// Feature check
		if (this.context.features.includes(condition)) {
			return true;
		}

		return false;
	}

	/**
	 * Check if text contains Polish characters
	 */
	private containsPolishChars(text: string): boolean {
		return this.polishChars.test(text);
	}

	/**
	 * Convert string to kebab-case
	 */
	private kebabCase(str: string): string {
		return str
			.replace(/([a-z])([A-Z])/g, "$1-$2")
			.replace(/[\s_]+/g, "-")
			.toLowerCase();
	}

	/**
	 * Add custom variable
	 */
	addVariable(name: string, value: string): void {
		this.variables.set(name.toUpperCase(), value);
	}

	/**
	 * Get all current variables
	 */
	getVariables(): Map<string, string> {
		return new Map(this.variables);
	}
}
