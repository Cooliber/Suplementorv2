/**
 * File Structure Automation for Component Generation
 * Handles automatic creation of component files with proper organization
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { TemplateEngine } from "./template-engine.js";
import type { TemplateContext } from "./template-engine.js";

export interface FileTemplate {
	name: string;
	template: string;
	extension: string;
	subdirectory?: string;
}

export interface ComponentFileStructure {
	componentName: string;
	basePath: string;
	templates: FileTemplate[];
}

export class FileStructureAutomation {
	private templateEngine: TemplateEngine;

	constructor(context: TemplateContext) {
		this.templateEngine = new TemplateEngine(context);
	}

	/**
	 * Create complete component file structure
	 */
	async createComponentStructure(
		structure: ComponentFileStructure,
	): Promise<void> {
		const { componentName, basePath, templates } = structure;

		console.log(`Creating component structure for: ${componentName}`);

		// Create base directory
		const componentDir = join(basePath, componentName);
		this.ensureDirectoryExists(componentDir);

		// Generate all files from templates
		for (const template of templates) {
			await this.createFileFromTemplate(template, componentDir, componentName);
		}

		console.log(
			`✅ Component structure created successfully at: ${componentDir}`,
		);
	}

	/**
	 * Create individual file from template
	 */
	private async createFileFromTemplate(
		template: FileTemplate,
		componentDir: string,
		componentName: string,
	): Promise<void> {
		const {
			name,
			template: templateContent,
			extension,
			subdirectory,
		} = template;

		// Determine file path
		const fileName = this.generateFileName(name, componentName, extension);
		const subDir = subdirectory
			? join(componentDir, subdirectory)
			: componentDir;
		const filePath = join(subDir, fileName);

		// Ensure subdirectory exists
		this.ensureDirectoryExists(subDir);

		// Process template content
		const processedContent =
			this.templateEngine.processTemplate(templateContent);

		// Write file
		writeFileSync(filePath, processedContent, "utf8");

		console.log(`  📄 Created: ${filePath}`);
	}

	/**
	 * Generate appropriate file name based on template type
	 */
	private generateFileName(
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

	/**
	 * Ensure directory exists, create if it doesn't
	 */
	private ensureDirectoryExists(dirPath: string): void {
		if (!existsSync(dirPath)) {
			mkdirSync(dirPath, { recursive: true });
		}
	}

	/**
	 * Validate component structure before creation
	 */
	validateStructure(structure: ComponentFileStructure): {
		valid: boolean;
		errors: string[];
	} {
		const errors: string[] = [];

		if (!structure.componentName) {
			errors.push("Component name is required");
		}

		if (!structure.basePath) {
			errors.push("Base path is required");
		}

		if (!structure.templates || structure.templates.length === 0) {
			errors.push("At least one template is required");
		}

		// Validate template names
		const validTemplateNames = [
			"index",
			"component",
			"test",
			"stories",
			"types",
		];
		structure.templates.forEach((template, index) => {
			if (!validTemplateNames.includes(template.name)) {
				errors.push(
					`Invalid template name at index ${index}: ${template.name}`,
				);
			}
		});

		return {
			valid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Get default file structure for different component types
	 */
	getDefaultStructure(
		componentType: string,
	): Omit<ComponentFileStructure, "componentName"> {
		const baseTemplates: FileTemplate[] = [
			{
				name: "types",
				extension: "ts",
				template: this.getTypesTemplate(),
			},
			{
				name: "component",
				extension: "tsx",
				template: this.getComponentTemplate(componentType),
			},
			{
				name: "index",
				extension: "ts",
				template: this.getIndexTemplate(),
			},
		];

		// Add type-specific templates
		switch (componentType) {
			case "ui":
				return {
					basePath: "src/components/ui",
					templates: [
						...baseTemplates,
						{
							name: "test",
							extension: "tsx",
							template: this.getTestTemplate(),
						},
						{
							name: "stories",
							extension: "tsx",
							template: this.getStoriesTemplate(),
						},
					],
				};

			case "feature":
				return {
					basePath: "src/components",
					templates: [
						...baseTemplates,
						{
							name: "test",
							extension: "tsx",
							template: this.getTestTemplate(),
						},
						{
							name: "stories",
							extension: "tsx",
							template: this.getStoriesTemplate(),
						},
					],
				};

			default:
				return {
					basePath: "src/components",
					templates: baseTemplates,
				};
		}
	}

	/**
	 * Get TypeScript types template
	 */
	private getTypesTemplate(): string {
		return `// types.ts
export interface \${COMPONENT_NAME}Props {
  className?: string;
  children?: React.ReactNode;
  // Add more props as needed
}

export interface \${COMPONENT_NAME}Data {
  id: string;
  name: string;
  // Add more data properties as needed
}
`;
	}

	/**
	 * Get component template
	 */
	private getComponentTemplate(componentType: string): string {
		const isUI = componentType === "ui";

		return `// \${COMPONENT_NAME}.tsx
import React from 'react';
import { cn } from '@/lib/utils';
\${HAS_POLISH_LOCALIZATION}

export interface \${COMPONENT_NAME}Props {
 className?: string;
 children?: React.ReactNode;
}

export function \${COMPONENT_NAME}({
 className,
 children,
 ...props
}: \${COMPONENT_NAME}Props) {
\${POLISH_HOOK_DECLARATION}

 return (
   <div
     className={cn(
       "component-base-styles",
       className
     )}
     {...props}
   >
\${COMPONENT_CONTENT}
     {children}
   </div>
 );
}

export default \${COMPONENT_NAME};
`;
	}

	/**
	 * Get index template
	 */
	private getIndexTemplate(): string {
		return `// index.ts
export { \${COMPONENT_NAME} } from './\${COMPONENT_NAME}';
export type { \${COMPONENT_NAME}Props, \${COMPONENT_NAME}Data } from './types';
export default \${COMPONENT_NAME};
`;
	}

	/**
	 * Get test template
	 */
	private getTestTemplate(): string {
		return `// \${COMPONENT_NAME}.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { \${COMPONENT_NAME} } from './\${COMPONENT_NAME}';

describe('\${COMPONENT_NAME}', () => {
 it('renders without crashing', () => {
   render(<\${COMPONENT_NAME} />);
   expect(document.querySelector('.component-base-styles')).toBeInTheDocument();
 });
\${POLISH_TEST_CONTENT}

 it('applies custom className', () => {
   render(<\${COMPONENT_NAME} className="custom-class" />);
   expect(document.querySelector('.custom-class')).toBeInTheDocument();
 });
});
`;
	}

	/**
	 * Get Storybook stories template
	 */
	private getStoriesTemplate(): string {
		return `// \${COMPONENT_NAME}.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { \${COMPONENT_NAME} } from './\${COMPONENT_NAME}';

const meta: Meta<typeof \${COMPONENT_NAME}> = {
 title: 'Components/\${COMPONENT_NAME}',
 component: \${COMPONENT_NAME},
 parameters: {
   layout: 'centered',
   docs: {
     description: {
       component: '\${DESCRIPTION}',
     },
   },
 },
 tags: ['autodocs'],
 argTypes: {
   className: {
     control: 'text',
     description: 'Additional CSS classes',
   },
 },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
 args: {},
};

export const WithCustomClass: Story = {
 args: {
   className: 'custom-styling',
 },
};
\${POLISH_STORY_CONTENT}
`;
	}
}
