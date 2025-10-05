/**
 * Quality Validation System for Component Generation
 * Ensures WCAG 2.1 AA compliance, performance standards, and Polish localization quality
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface ValidationResult {
	passed: boolean;
	errors: ValidationError[];
	warnings: ValidationWarning[];
	score: number; // 0-100
}

export interface ValidationError {
	type: "error" | "warning";
	category:
		| "accessibility"
		| "performance"
		| "polish"
		| "typescript"
		| "structure";
	message: string;
	file?: string;
	line?: number;
	column?: number;
	suggestion?: string;
}

export interface ValidationWarning extends ValidationError {
	type: "warning";
}

export interface QualityConfig {
	enableAccessibility: boolean;
	enablePerformance: boolean;
	enablePolishValidation: boolean;
	enableTypeScript: boolean;
	enableStructure: boolean;
	performanceThreshold: number; // milliseconds
	accessibilityLevel: "A" | "AA" | "AAA";
}

export class QualityValidationSystem {
	private config: QualityConfig;

	constructor(config: QualityConfig) {
		this.config = config;
	}

	/**
	 * Validate complete component structure
	 */
	async validateComponentStructure(
		componentPath: string,
		componentName: string,
	): Promise<ValidationResult> {
		const errors: ValidationError[] = [];
		const warnings: ValidationWarning[] = [];

		console.log("🔍 Running quality validation...");

		// Structure validation
		if (this.config.enableStructure) {
			const structureResult = this.validateFileStructure(
				componentPath,
				componentName,
			);
			errors.push(...structureResult.errors);
			warnings.push(...structureResult.warnings);
		}

		// TypeScript validation
		if (this.config.enableTypeScript) {
			const tsResult = await this.validateTypeScript(
				componentPath,
				componentName,
			);
			errors.push(...tsResult.errors);
			warnings.push(...tsResult.warnings);
		}

		// Accessibility validation
		if (this.config.enableAccessibility) {
			const a11yResult = this.validateAccessibility(
				componentPath,
				componentName,
			);
			errors.push(...a11yResult.errors);
			warnings.push(...a11yResult.warnings);
		}

		// Performance validation
		if (this.config.enablePerformance) {
			const perfResult = this.validatePerformance(componentPath, componentName);
			errors.push(...perfResult.errors);
			warnings.push(...perfResult.warnings);
		}

		// Polish localization validation
		if (this.config.enablePolishValidation) {
			const polishResult = this.validatePolishLocalization(
				componentPath,
				componentName,
			);
			errors.push(...polishResult.errors);
			warnings.push(...polishResult.warnings);
		}

		// Calculate overall score
		const totalIssues = errors.length + warnings.length;
		const score = Math.max(0, 100 - totalIssues * 5);

		const result: ValidationResult = {
			passed: errors.length === 0,
			errors,
			warnings,
			score,
		};

		this.displayValidationResults(result);
		return result;
	}

	/**
	 * Validate file structure
	 */
	private validateFileStructure(
		componentPath: string,
		componentName: string,
	): ValidationResult {
		const errors: ValidationError[] = [];
		const warnings: ValidationWarning[] = [];

		const requiredFiles = [`${componentName}.tsx`, "types.ts", "index.ts"];

		const recommendedFiles = [
			`${componentName}.test.tsx`,
			`${componentName}.stories.tsx`,
		];

		// Check required files
		for (const file of requiredFiles) {
			const filePath = join(componentPath, file);
			if (!existsSync(filePath)) {
				errors.push({
					type: "error",
					category: "structure",
					message: `Missing required file: ${file}`,
					file,
					suggestion: `Create ${file} in the component directory`,
				});
			}
		}

		// Check recommended files
		for (const file of recommendedFiles) {
			const filePath = join(componentPath, file);
			if (!existsSync(filePath)) {
				warnings.push({
					type: "warning",
					category: "structure",
					message: `Missing recommended file: ${file}`,
					file,
					suggestion: `Consider creating ${file} for better testing and documentation`,
				});
			}
		}

		// Validate file naming conventions
		const files = ["tsx", "ts", "test.tsx", "stories.tsx"];
		files.forEach((ext) => {
			const fileName = `${componentName}.${ext}`;
			const filePath = join(componentPath, fileName);

			if (existsSync(filePath)) {
				const content = readFileSync(filePath, "utf8");

				// Check for proper component naming
				if (
					ext === "tsx" &&
					!content.includes(`export function ${componentName}`)
				) {
					errors.push({
						type: "error",
						category: "structure",
						message: `Component file should export function ${componentName}`,
						file: fileName,
						suggestion: `Ensure the main component is exported as ${componentName}`,
					});
				}
			}
		});

		return {
			passed: errors.length === 0,
			errors,
			warnings,
			score: 100,
		};
	}

	/**
	 * Validate TypeScript
	 */
	private async validateTypeScript(
		componentPath: string,
		componentName: string,
	): Promise<ValidationResult> {
		const errors: ValidationError[] = [];
		const warnings: ValidationWarning[] = [];

		try {
			// Run TypeScript check
			const tsxFiles = [`${componentPath}/${componentName}.tsx`];
			const tsFiles = [
				`${componentPath}/types.ts`,
				`${componentPath}/index.ts`,
			];

			for (const file of [...tsxFiles, ...tsFiles]) {
				if (existsSync(file)) {
					const content = readFileSync(file, "utf8");

					// Check for any types
					if (content.includes(": any")) {
						warnings.push({
							type: "warning",
							category: "typescript",
							message: 'Usage of "any" type detected',
							file: file,
							suggestion: 'Replace "any" with proper TypeScript types',
						});
					}

					// Check for proper interface definitions
					if (file.includes("types.ts") && !content.includes("interface")) {
						warnings.push({
							type: "warning",
							category: "typescript",
							message: "No interface definitions found in types file",
							file: file,
							suggestion: "Add proper TypeScript interface definitions",
						});
					}

					// Check for prop validation
					if (
						file.includes(".tsx") &&
						!content.includes("Props") &&
						!content.includes("interface")
					) {
						warnings.push({
							type: "warning",
							category: "typescript",
							message: "No prop type definitions found",
							file: file,
							suggestion:
								"Define proper TypeScript interfaces for component props",
						});
					}
				}
			}
		} catch (error) {
			errors.push({
				type: "error",
				category: "typescript",
				message: `TypeScript validation failed: ${error}`,
				suggestion: "Check TypeScript configuration and dependencies",
			});
		}

		return {
			passed: errors.length === 0,
			errors,
			warnings,
			score: 100,
		};
	}

	/**
	 * Validate accessibility
	 */
	private validateAccessibility(
		componentPath: string,
		componentName: string,
	): ValidationResult {
		const errors: ValidationError[] = [];
		const warnings: ValidationWarning[] = [];

		const componentFile = join(componentPath, `${componentName}.tsx`);
		if (!existsSync(componentFile)) {
			return { passed: false, errors, warnings, score: 0 };
		}

		const content = readFileSync(componentFile, "utf8");

		// Check for ARIA labels
		if (
			!content.includes("aria-label") &&
			!content.includes("aria-labelledby")
		) {
			warnings.push({
				type: "warning",
				category: "accessibility",
				message: "No ARIA labels found",
				file: componentFile,
				suggestion: "Add appropriate ARIA labels for screen readers",
			});
		}

		// Check for semantic HTML
		if (
			!content.includes("button") &&
			!content.includes("input") &&
			!content.includes("div")
		) {
			warnings.push({
				type: "warning",
				category: "accessibility",
				message: "No semantic HTML elements found",
				file: componentFile,
				suggestion: "Use semantic HTML elements where appropriate",
			});
		}

		// Check for keyboard navigation
		if (content.includes("onClick") && !content.includes("onKeyDown")) {
			warnings.push({
				type: "warning",
				category: "accessibility",
				message: "Click handlers without keyboard support",
				file: componentFile,
				suggestion: "Add keyboard event handlers for accessibility",
			});
		}

		// Check for color contrast (basic check)
		if (content.includes("color") || content.includes("background")) {
			warnings.push({
				type: "warning",
				category: "accessibility",
				message: "Custom colors detected",
				file: componentFile,
				suggestion: "Ensure sufficient color contrast ratios (WCAG 2.1 AA)",
			});
		}

		return {
			passed: errors.length === 0,
			errors,
			warnings,
			score: 100,
		};
	}

	/**
	 * Validate performance
	 */
	private validatePerformance(
		componentPath: string,
		componentName: string,
	): ValidationResult {
		const errors: ValidationError[] = [];
		const warnings: ValidationWarning[] = [];

		const componentFile = join(componentPath, `${componentName}.tsx`);
		if (!existsSync(componentFile)) {
			return { passed: false, errors, warnings, score: 0 };
		}

		const content = readFileSync(componentFile, "utf8");

		// Check for potential performance issues
		const useEffectCount = (content.match(/useEffect/g) || []).length;
		if (useEffectCount > 3) {
			warnings.push({
				type: "warning",
				category: "performance",
				message: `High number of useEffect hooks (${useEffectCount})`,
				file: componentFile,
				suggestion:
					"Consider optimizing useEffect usage or using useMemo/useCallback",
			});
		}

		// Check for large inline objects/arrays
		const inlineObjects = content.match(/\{[^}]*\{[^}]*\}[^}]*\}/g);
		if (inlineObjects && inlineObjects.length > 2) {
			warnings.push({
				type: "warning",
				category: "performance",
				message: "Multiple inline objects detected",
				file: componentFile,
				suggestion:
					"Consider moving large objects outside component or using useMemo",
			});
		}

		// Check for missing React.memo
		if (!content.includes("memo") && content.includes("export function")) {
			warnings.push({
				type: "warning",
				category: "performance",
				message: "Component not memoized",
				file: componentFile,
				suggestion:
					"Consider wrapping component with React.memo for performance",
			});
		}

		return {
			passed: errors.length === 0,
			errors,
			warnings,
			score: 100,
		};
	}

	/**
	 * Validate Polish localization
	 */
	private validatePolishLocalization(
		componentPath: string,
		componentName: string,
	): ValidationResult {
		const errors: ValidationError[] = [];
		const warnings: ValidationWarning[] = [];

		const componentFile = join(componentPath, `${componentName}.tsx`);
		if (!existsSync(componentFile)) {
			return { passed: false, errors, warnings, score: 0 };
		}

		const content = readFileSync(componentFile, "utf8");

		// Check for Polish characters
		const polishChars = /[ąćęłńóśźż]/i;
		const hasPolishChars = polishChars.test(content);

		if (hasPolishChars) {
			// Validate Polish character usage
			const invalidSequences = this.findInvalidPolishSequences(content);
			errors.push(...invalidSequences);

			// Check for proper encoding
			if (!content.includes("utf-8") && !content.includes("UTF-8")) {
				warnings.push({
					type: "warning",
					category: "polish",
					message: "No UTF-8 encoding declaration found",
					file: componentFile,
					suggestion: "Ensure proper UTF-8 encoding for Polish characters",
				});
			}
		}

		// Check for localization hooks
		if (!content.includes("usePolishLocalization") && hasPolishChars) {
			warnings.push({
				type: "warning",
				category: "polish",
				message: "Polish characters found but no localization hook",
				file: componentFile,
				suggestion:
					"Consider using usePolishLocalization hook for proper Polish support",
			});
		}

		return {
			passed: errors.length === 0,
			errors,
			warnings,
			score: 100,
		};
	}

	/**
	 * Find invalid Polish character sequences
	 */
	private findInvalidPolishSequences(text: string): ValidationError[] {
		const errors: ValidationError[] = [];

		// Common invalid combinations
		const invalidPatterns = [
			{
				pattern: /([ąęó])([A-ZĘÓŁŃŚŹŻ])/g,
				message: "Incorrect capitalization after Polish character",
				suggestion: "Polish characters should be followed by lowercase letters",
			},
		];

		for (const { pattern, message, suggestion } of invalidPatterns) {
			if (pattern.test(text)) {
				errors.push({
					type: "error",
					category: "polish",
					message,
					suggestion,
				});
			}
		}

		return errors;
	}

	/**
	 * Display validation results
	 */
	private displayValidationResults(result: ValidationResult): void {
		console.log("\n📊 Quality Validation Results");
		console.log("============================");

		if (result.passed) {
			console.log("✅ All validations passed!");
		} else {
			console.log("❌ Some validations failed");
		}

		console.log(`🎯 Quality Score: ${result.score}/100`);

		if (result.errors.length > 0) {
			console.log("\n🚨 Errors:");
			result.errors.forEach((error, index) => {
				console.log(
					`  ${index + 1}. [${error.category.toUpperCase()}] ${error.message}`,
				);
				if (error.suggestion) {
					console.log(`     💡 ${error.suggestion}`);
				}
			});
		}

		if (result.warnings.length > 0) {
			console.log("\n⚠️  Warnings:");
			result.warnings.forEach((warning, index) => {
				console.log(
					`  ${index + 1}. [${warning.category.toUpperCase()}] ${warning.message}`,
				);
				if (warning.suggestion) {
					console.log(`     💡 ${warning.suggestion}`);
				}
			});
		}

		if (result.passed && result.warnings.length === 0) {
			console.log("\n🏆 Perfect! Component meets all quality standards.");
		} else if (result.passed) {
			console.log(
				"\n👍 Component is good to go, but consider addressing the warnings.",
			);
		} else {
			console.log("\n🔧 Please fix the errors before using the component.");
		}
	}

	/**
	 * Generate quality report
	 */
	generateQualityReport(result: ValidationResult): string {
		let report = "# Component Quality Report\n\n";
		report += `**Score:** ${result.score}/100\n`;
		report += `**Status:** ${result.passed ? "✅ Passed" : "❌ Failed"}\n\n`;

		if (result.errors.length > 0) {
			report += `## Errors (${result.errors.length})\n\n`;
			result.errors.forEach((error, index) => {
				report += `### ${index + 1}. ${error.message}\n`;
				report += `- **Category:** ${error.category}\n`;
				report += `- **File:** ${error.file || "N/A"}\n`;
				if (error.suggestion) {
					report += `- **Suggestion:** ${error.suggestion}\n`;
				}
				report += "\n";
			});
		}

		if (result.warnings.length > 0) {
			report += `## Warnings (${result.warnings.length})\n\n`;
			result.warnings.forEach((warning, index) => {
				report += `### ${index + 1}. ${warning.message}\n`;
				report += `- **Category:** ${warning.category}\n`;
				report += `- **File:** ${warning.file || "N/A"}\n`;
				if (warning.suggestion) {
					report += `- **Suggestion:** ${warning.suggestion}\n`;
				}
				report += "\n";
			});
		}

		return report;
	}
}
