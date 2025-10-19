#!/usr/bin/env tsx
/**
 * Development Environment Setup Script
 * Sets up the complete development environment for Suplementor
 */

import { execSync } from "child_process";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";

interface SetupOptions {
  skipDocker?: boolean;
  skipDatabase?: boolean;
  skipInstall?: boolean;
  environment?: "development" | "staging" | "production";
  withAI?: boolean;
}

/**
 * Colors for console output
 */
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

/**
 * Log with colors
 */
function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Execute shell command
 */
function exec(command: string, errorMessage?: string): boolean {
  try {
    log(`Executing: ${command}`, "cyan");
    execSync(command, { stdio: "inherit" });
    return true;
  } catch (error) {
    if (errorMessage) {
      log(errorMessage, "red");
    } else {
      log(`Command failed: ${command}`, "red");
    }
    return false;
  }
}

/**
 * Check if command exists
 */
function commandExists(command: string): boolean {
  try {
    execSync(`${command} --version`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Setup development environment
 */
async function setupDevelopmentEnvironment(options: SetupOptions = {}): Promise<void> {
  const {
    skipDocker = false,
    skipDatabase = false,
    skipInstall = false,
    environment = "development",
    withAI = false,
  } = options;

  log("🚀 Setting up Suplementor Development Environment", "bright");
  log(`Environment: ${environment}`, "blue");
  log("================================================", "bright");

  // Check prerequisites
  await checkPrerequisites();

  // Install dependencies
  if (!skipInstall) {
    await installDependencies();
  }

  // Setup environment files
  await setupEnvironmentFiles(environment);

  // Generate encryption keys
  await generateEncryptionKeys();

  // Setup database
  if (!skipDatabase) {
    await setupDatabase();
  }

  // Setup Docker environment
  if (!skipDocker) {
    await setupDockerEnvironment(withAI);
  }

  // Run database migrations
  await runDatabaseMigrations();

  // Seed database with sample data
  await seedDatabase();

  // Validate setup
  await validateSetup();

  // Print success message
  printSuccessMessage(environment, withAI);
}

/**
 * Check development prerequisites
 */
async function checkPrerequisites(): Promise<void> {
  log("\n🔍 Checking prerequisites...", "yellow");

  const prerequisites = [
    { command: "node", name: "Node.js", required: true },
    { command: "npm", name: "NPM", required: true },
    { command: "docker", name: "Docker", required: false },
    { command: "docker-compose", name: "Docker Compose", required: false },
  ];

  for (const prereq of prerequisites) {
    const exists = commandExists(prereq.command);
    const status = exists ? "✅" : prereq.required ? "❌" : "⚠️ ";
    const color = exists ? "green" : prereq.required ? "red" : "yellow";

    log(`${status} ${prereq.name}`, color);

    if (prereq.required && !exists) {
      throw new Error(`${prereq.name} is required but not installed. Please install it first.`);
    }
  }

  log("Prerequisites check completed!", "green");
}

/**
 * Install project dependencies
 */
async function installDependencies(): Promise<void> {
  log("\n📦 Installing dependencies...", "yellow");

  if (!exec("npm install", "Failed to install dependencies")) {
    throw new Error("Dependency installation failed");
  }

  log("Dependencies installed successfully!", "green");
}

/**
 * Setup environment files
 */
async function setupEnvironmentFiles(environment: string): Promise<void> {
  log(`\n🔧 Setting up ${environment} environment files...`, "yellow");

  const envFile = `.env.${environment}`;
  const localEnvFile = ".env.local";

  // Copy environment file if it exists
  if (existsSync(envFile)) {
    if (!existsSync(localEnvFile)) {
      execSync(`cp ${envFile} ${localEnvFile}`);
      log(`✅ Created ${localEnvFile} from ${envFile}`, "green");
    } else {
      log(`⚠️  ${localEnvFile} already exists, skipping copy`, "yellow");
    }
  } else {
    log(`⚠️  ${envFile} not found, creating basic .env.local`, "yellow");
    createBasicEnvFile();
  }

  // Generate NextAuth secret if not present
  await generateNextAuthSecret();
}

/**
 * Create basic environment file
 */
function createBasicEnvFile(): void {
  const envContent = `# Suplementor Development Environment
NODE_ENV=development
NEXTAUTH_SECRET=development-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Database (optional for development)
DATABASE_URL="file:./dev.db"
MONGODB_URI="mongodb://localhost:27017/suplementor_dev"

# Medical App Configuration
MEDICAL_DATA_PROTECTION=enabled
GDPR_COMPLIANCE_MODE=strict
POLISH_LOCALIZATION=enabled

# Development Tools
ENABLE_DEBUG_LOGS=true
ENABLE_MOCK_DATA=true
ENABLE_PLAYGROUND=true

# Feature Flags
FEATURE_BRAIN_3D=enabled
FEATURE_SUPPLEMENT_TRACKING=enabled
FEATURE_GAMIFICATION=enabled

# Client-side Variables
NEXT_PUBLIC_MEDICAL_DISCLAIMER=enabled
NEXT_PUBLIC_GDPR_COMPLIANCE=strict
NEXT_PUBLIC_DEFAULT_LOCALE=pl
NEXT_PUBLIC_APP_VERSION=1.0.0-dev
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=true
`;

  writeFileSync(".env.local", envContent);
  log("✅ Created basic .env.local file", "green");
}

/**
 * Generate NextAuth secret
 */
async function generateNextAuthSecret(): Promise<void> {
  const envFile = ".env.local";
  let envContent = "";

  if (existsSync(envFile)) {
    envContent = readFileSync(envFile, "utf8");
  }

  if (!envContent.includes("NEXTAUTH_SECRET") || envContent.includes("development-secret-key")) {
    const secret = require("crypto").randomBytes(32).toString("hex");

    if (envContent.includes("NEXTAUTH_SECRET")) {
      // Replace existing secret
      envContent = envContent.replace(
        /NEXTAUTH_SECRET=.*/,
        `NEXTAUTH_SECRET=${secret}`
      );
    } else {
      // Add new secret
      envContent += `\nNEXTAUTH_SECRET=${secret}`;
    }

    writeFileSync(envFile, envContent);
    log("✅ Generated new NextAuth secret", "green");
  } else {
    log("✅ NextAuth secret already configured", "green");
  }
}

/**
 * Generate encryption keys
 */
async function generateEncryptionKeys(): Promise<void> {
  log("\n🔐 Generating encryption keys...", "yellow");

  if (exec("npm run keys:generate development", "Failed to generate encryption keys")) {
    log("✅ Encryption keys generated successfully!", "green");
  } else {
    log("⚠️  Encryption key generation failed, but continuing setup", "yellow");
  }
}

/**
 * Setup database
 */
async function setupDatabase(): Promise<void> {
  log("\n🗄️  Setting up database...", "yellow");

  // Generate Prisma client
  if (exec("npx prisma generate", "Failed to generate Prisma client")) {
    log("✅ Prisma client generated", "green");
  }

  // Run database migrations
  if (exec("npm run migrate", "Failed to run database migrations")) {
    log("✅ Database migrations completed", "green");
  }
}

/**
 * Setup Docker environment
 */
async function setupDockerEnvironment(withAI: boolean): Promise<void> {
  log("\n🐳 Setting up Docker environment...", "yellow");

  // Start core services
  const services = ["postgres", "mongo", "redis"];
  if (withAI) {
    services.push("embedding-service");
  }

  const serviceString = services.join(",");
  if (exec(`docker-compose up -d ${serviceString}`, "Failed to start Docker services")) {
    log(`✅ Docker services started: ${serviceString}`, "green");
  }

  // Wait for services to be ready
  log("⏳ Waiting for services to be ready...", "yellow");
  execSync("sleep 10");

  // Run database initialization
  if (exec("docker-compose exec postgres psql -U suplementor -d suplementor_dev -f /docker-entrypoint-initdb.d/init.sql",
    "Failed to initialize PostgreSQL database")) {
    log("✅ PostgreSQL database initialized", "green");
  }

  if (exec("docker-compose exec mongo mongo suplementor_dev /docker-entrypoint-initdb.d/mongo-init.js",
    "Failed to initialize MongoDB database")) {
    log("✅ MongoDB database initialized", "green");
  }
}

/**
 * Run database migrations
 */
async function runDatabaseMigrations(): Promise<void> {
  log("\n🔄 Running database migrations...", "yellow");

  if (exec("npm run migrate", "Failed to run database migrations")) {
    log("✅ Database migrations completed", "green");
  }
}

/**
 * Seed database with sample data
 */
async function seedDatabase(): Promise<void> {
  log("\n🌱 Seeding database with sample data...", "yellow");

  if (exec("npm run db:seed", "Failed to seed database")) {
    log("✅ Database seeded successfully", "green");
  }
}

/**
 * Validate setup
 */
async function validateSetup(): Promise<void> {
  log("\n✅ Validating setup...", "yellow");

  // Check if app builds successfully
  if (exec("npm run build", "Build validation failed")) {
    log("✅ Application builds successfully", "green");
  }

  // Check if health endpoint works
  log("🏥 Checking application health...", "yellow");
  try {
    const healthResponse = execSync("curl -s http://localhost:3000/api/health || echo 'Health check pending'");
    log("✅ Health check completed", "green");
  } catch {
    log("⏳ Health check will be available after starting the development server", "yellow");
  }
}

/**
 * Print success message
 */
function printSuccessMessage(environment: string, withAI: boolean): void {
  log("\n🎉 Development environment setup completed successfully!", "bright");
  log("========================================================", "bright");

  log("\n🚀 To start developing:", "cyan");
  log("   1. Start the development server:", "cyan");
  log("      npm run dev", "cyan");
  log("", "cyan");
  log("   2. Open your browser and navigate to:", "cyan");
  log("      http://localhost:3000", "cyan");
  log("", "cyan");
  log("   3. (Optional) Start all services with Docker:", "cyan");
  log("      docker-compose up", "cyan");

  if (withAI) {
    log("", "cyan");
    log("   4. AI features are enabled - embedding service is running on:", "cyan");
    log("      http://localhost:8000", "cyan");
  }

  log("\n📚 Useful commands:", "cyan");
  log("   npm run dev:setup     - Re-run this setup", "cyan");
  log("   npm run dev:clean     - Clean development cache", "cyan");
  log("   npm run dev:reset     - Reset entire development environment", "cyan");
  log("   npm run keys:generate - Generate new encryption keys", "cyan");
  log("   npm run test          - Run tests", "cyan");
  log("   npm run typecheck     - Check TypeScript types", "cyan");

  log("\n🔧 Environment files:", "cyan");
  log("   .env.local           - Your local environment configuration", "cyan");
  log("   .env.development     - Development environment template", "cyan");
  log("   .env.staging         - Staging environment configuration", "cyan");
  log("   .env.production      - Production environment configuration", "cyan");

  log("\n⚠️  Security reminders:", "yellow");
  log("   - Never commit .env.local or real secrets to version control", "yellow");
  log("   - Rotate encryption keys regularly in production", "yellow");
  log("   - Review GDPR compliance settings before deploying", "yellow");
  log("   - Run security audits regularly", "yellow");

  log("\n🎯 Happy coding! 🚀", "bright");
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options: SetupOptions = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--skip-docker":
        options.skipDocker = true;
        break;
      case "--skip-database":
        options.skipDatabase = true;
        break;
      case "--skip-install":
        options.skipInstall = true;
        break;
      case "--with-ai":
        options.withAI = true;
        break;
      case "--environment":
        options.environment = args[++i] as SetupOptions["environment"];
        break;
      default:
        if (args[i].startsWith("--environment=")) {
          options.environment = args[i].split("=")[1] as SetupOptions["environment"];
        }
    }
  }

  try {
    await setupDevelopmentEnvironment(options);
  } catch (error) {
    log(`\n❌ Setup failed: ${error instanceof Error ? error.message : "Unknown error"}`, "red");
    log("\n🔧 Troubleshooting:", "yellow");
    log("   1. Make sure all prerequisites are installed", "yellow");
    log("   2. Check that ports 3000, 5432, 27017 are available", "yellow");
    log("   3. Try running with --skip-docker if Docker is not needed", "yellow");
    log("   4. Check the logs above for specific error messages", "yellow");
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { setupDevelopmentEnvironment };