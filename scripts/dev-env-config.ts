// scripts/dev-env-config.ts
/**
 * Development Environment Configuration for Suplementor Platform
 * Sets up development environment variables and configurations
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

interface DevelopmentConfig {
	// Environment variables
	environment: "development" | "staging" | "production";
	port: number;
	database: {
		url: string;
		name: string;
		enableLogging: boolean;
	};
	auth: {
		secret: string;
		providers: string[];
	};
	localization: {
		defaultLanguage: "pl" | "en";
		supportedLanguages: string[];
		enableMedicalTerms: boolean;
		enableValidation: boolean;
	};
	componentGeneration: {
		outputDirectory: string;
		templateDirectory: string;
		enablePolishLocalization: boolean;
		enableAccessibility: boolean;
		enablePerformanceOptimizations: boolean;
	};
	development: {
		enableHotReload: boolean;
		enableSourceMaps: boolean;
		enableDebugMode: boolean;
		enableComponentValidation: boolean;
	};
}

const DEFAULT_CONFIG: DevelopmentConfig = {
	environment: "development",
	port: 3000,
	database: {
		url: "mongodb://localhost:27017",
		name: "suplementor_dev",
		enableLogging: true,
	},
	auth: {
		secret: "your-secret-key-change-in-production",
		providers: ["credentials", "google", "github"],
	},
	localization: {
		defaultLanguage: "pl",
		supportedLanguages: ["pl", "en"],
		enableMedicalTerms: true,
		enableValidation: true,
	},
	componentGeneration: {
		outputDirectory: "src/components/generated",
		templateDirectory: "scripts/component-generator/templates",
		enablePolishLocalization: true,
		enableAccessibility: true,
		enablePerformanceOptimizations: true,
	},
	development: {
		enableHotReload: true,
		enableSourceMaps: true,
		enableDebugMode: true,
		enableComponentValidation: true,
	},
};

/**
 * Generate environment variables file
 */
function generateEnvFile(config: DevelopmentConfig): void {
	const envContent = `# Suplementor Development Environment Variables
# Generated on: ${new Date().toISOString()}

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
PORT=${config.port}

# Database
DATABASE_URL="${config.database.url}/${config.database.name}"
MONGODB_DB="${config.database.name}"
DB_LOGGING=${config.database.enableLogging}

# Authentication
NEXTAUTH_SECRET="${config.auth.secret}"
NEXTAUTH_URL="http://localhost:${config.port}"

# Localization
NEXT_PUBLIC_DEFAULT_LANGUAGE="${config.localization.defaultLanguage}"
NEXT_PUBLIC_SUPPORTED_LANGUAGES="${config.localization.supportedLanguages.join(",")}"
NEXT_PUBLIC_ENABLE_MEDICAL_TERMS=${config.localization.enableMedicalTerms}
NEXT_PUBLIC_ENABLE_LOCALIZATION_VALIDATION=${config.localization.enableValidation}

# Component Generation
COMPONENT_OUTPUT_DIR="${config.componentGeneration.outputDirectory}"
TEMPLATE_DIR="${config.componentGeneration.templateDirectory}"
ENABLE_POLISH_LOCALIZATION=${config.componentGeneration.enablePolishLocalization}
ENABLE_ACCESSIBILITY=${config.componentGeneration.enableAccessibility}
ENABLE_PERFORMANCE_OPTIMIZATIONS=${config.componentGeneration.enablePerformanceOptimizations}

# Development Features
ENABLE_HOT_RELOAD=${config.development.enableHotReload}
ENABLE_SOURCE_MAPS=${config.development.enableSourceMaps}
ENABLE_DEBUG_MODE=${config.development.enableDebugMode}
ENABLE_COMPONENT_VALIDATION=${config.development.enableComponentValidation}

# External APIs (add your keys here)
# OPENAI_API_KEY=""
# STRIPE_PUBLISHABLE_KEY=""
# GOOGLE_ANALYTICS_ID=""
`;

	const envPath = join(process.cwd(), ".env.local");
	writeFileSync(envPath, envContent);
	console.log("✅ Generated .env.local file");
}

/**
 * Generate TypeScript configuration for development
 */
function generateTsConfig(): void {
	const tsConfig = {
		extends: "./tsconfig.json",
		compilerOptions: {
			baseUrl: ".",
			paths: {
				"@/*": ["./src/*"],
				"@/components/*": ["./src/components/*"],
				"@/lib/*": ["./src/lib/*"],
				"@/hooks/*": ["./src/hooks/*"],
				"@/styles/*": ["./src/styles/*"],
				"@/utils/*": ["./src/lib/utils/*"],
				"@/localization/*": ["./src/lib/localization/*"],
			},
			strict: true,
			noUnusedLocals: false,
			noUnusedParameters: false,
			sourceMap: true,
			declaration: false,
			declarationMap: false,
			removeComments: false,
		},
		include: [
			"next-env.d.ts",
			"**/*.ts",
			"**/*.tsx",
			"scripts/**/*.ts",
			".next/types/**/*.ts",
		],
		exclude: ["node_modules", ".next", "dist", "build"],
	};

	const tsConfigPath = join(process.cwd(), "tsconfig.dev.json");
	writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
	console.log("✅ Generated tsconfig.dev.json file");
}

/**
 * Generate development configuration JSON
 */
function generateDevConfigJson(config: DevelopmentConfig): void {
	const configPath = join(process.cwd(), "dev.config.json");
	writeFileSync(configPath, JSON.stringify(config, null, 2));
	console.log("✅ Generated dev.config.json file");
}

/**
 * Create necessary directories
 */
function createDirectories(config: DevelopmentConfig): void {
	const dirs = [
		config.componentGeneration.outputDirectory,
		config.componentGeneration.templateDirectory,
		"src/lib/localization",
		"src/hooks",
		"scripts/component-generator/templates",
	];

	for (const dir of dirs) {
		const fullPath = join(process.cwd(), dir);
		if (!existsSync(fullPath)) {
			mkdirSync(fullPath, { recursive: true });
			console.log(`📁 Created directory: ${dir}`);
		}
	}
}

/**
 * Generate VSCode configuration for development
 */
function generateVSCodeConfig(): void {
	const settings = {
		"typescript.preferences.importModuleSpecifier": "relative",
		"typescript.suggest.autoImports": true,
		"editor.formatOnSave": true,
		"editor.defaultFormatter": "biomejs.biome",
		"editor.codeActionsOnSave": {
			"source.fixAll.biome": "explicit",
			"source.organizeImports.biome": "explicit",
		},
		"files.associations": {
			"*.tsx": "typescriptreact",
			"*.ts": "typescript",
		},
		"emmet.includeLanguages": {
			typescript: "typescriptreact",
			typescriptreact: "html",
		},
		"search.exclude": {
			"**/node_modules": true,
			"**/.next": true,
			"**/dist": true,
			"**/*.min.js": true,
		},
		"files.exclude": {
			"**/.git": true,
			"**/.DS_Store": true,
			"**/node_modules": true,
			"**/.next": true,
		},
	};

	const vscodeDir = join(process.cwd(), ".vscode");
	if (!existsSync(vscodeDir)) {
		mkdirSync(vscodeDir, { recursive: true });
	}

	const settingsPath = join(vscodeDir, "settings.json");
	writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
	console.log("✅ Generated VSCode settings.json file");
}

/**
 * Main setup function
 */
function setupDevelopmentEnvironment(): void {
	console.log("🚀 Setting up Suplementor development environment...");

	try {
		// Create necessary directories
		createDirectories(DEFAULT_CONFIG);

		// Generate configuration files
		generateEnvFile(DEFAULT_CONFIG);
		generateTsConfig();
		generateDevConfigJson(DEFAULT_CONFIG);
		generateVSCodeConfig();

		console.log("✅ Development environment setup completed successfully!");
		console.log("");
		console.log("📋 Next steps:");
		console.log(
			"1. Review the generated .env.local file and update any API keys",
		);
		console.log('2. Run "npm run dev" to start the development server');
		console.log('3. Use "npm run generate:component" to create new components');
		console.log(
			"4. Check the component generator documentation in scripts/component-generator/README.md",
		);
	} catch (error) {
		console.error("❌ Failed to setup development environment:", error);
		process.exit(1);
	}
}

/**
 * Update package.json with development scripts
 */
function updatePackageJson(): void {
	const packageJsonPath = join(process.cwd(), "package.json");

	if (!existsSync(packageJsonPath)) {
		console.error("❌ package.json not found");
		return;
	}

	// Read existing package.json
	const packageJson = JSON.parse(
		require("node:fs").readFileSync(packageJsonPath, "utf8"),
	);

	// Add development scripts
	const devScripts = {
		"dev:setup": "node scripts/dev-env-config.js setup",
		"dev:clean": "rm -rf .next && rm -rf node_modules/.cache",
		"dev:reset": "npm run dev:clean && npm install",
		"generate:component":
			"node scripts/component-generator/index.js --interactive",
		"generate:component:ui":
			"node scripts/component-generator/index.js --type ui",
		"generate:component:feature":
			"node scripts/component-generator/index.js --type feature",
		"generate:component:page":
			"node scripts/component-generator/index.js --type page",
		"generate:component:layout":
			"node scripts/component-generator/index.js --type layout",
		"validate:components":
			"node scripts/component-generator/index.js --validate",
		"localization:validate": "node scripts/validate-localization.js",
		"typecheck:dev": "tsc --noEmit --project tsconfig.dev.json",
	};

	// Merge scripts
	packageJson.scripts = { ...packageJson.scripts, ...devScripts };

	// Write back to package.json
	writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	console.log("✅ Updated package.json with development scripts");
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
	const args = process.argv.slice(2);
	const command = args[0];

	switch (command) {
		case "setup":
			setupDevelopmentEnvironment();
			break;
		case "update-package":
			updatePackageJson();
			break;
		default:
			console.log(`
Suplementor Development Environment Configuration

Usage:
  node scripts/dev-env-config.js <command>

Commands:
  setup           Setup complete development environment
  update-package  Update package.json with development scripts

Examples:
  node scripts/dev-env-config.js setup
  node scripts/dev-env-config.js update-package
      `);
	}
}

export { setupDevelopmentEnvironment, updatePackageJson, DEFAULT_CONFIG };
