#!/usr/bin/env node

/**
 * Medical App Deployment Script for Suplementor
 * Handles production deployment with medical compliance validation
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Medical compliance validation before deployment
 */
function validateMedicalCompliance() {
	console.log('🏥 Validating medical compliance...');

	const complianceChecks = {
		gdprCompliance: false,
		medicalDisclaimer: false,
		dataProtection: false,
		evidenceBasedContent: false,
		securityHeaders: false,
	};

	// Check for GDPR compliance
	try {
		const envFiles = ['.env.production', '.env'];
		let gdprCompliant = false;

		envFiles.forEach(envFile => {
			if (fs.existsSync(envFile)) {
				const content = fs.readFileSync(envFile, 'utf8');
				if (content.includes('GDPR_COMPLIANCE_MODE=strict')) {
					gdprCompliant = true;
				}
			}
		});

		if (gdprCompliant) {
			complianceChecks.gdprCompliance = true;
			console.log('  ✅ GDPR compliance enabled');
		} else {
			console.error('  ❌ GDPR compliance not properly configured');
		}
	} catch (error) {
		console.error('  ❌ Error checking GDPR compliance:', error.message);
	}

	// Check for medical disclaimer
	try {
		const layoutFiles = [
			'src/app/layout.tsx',
			'src/components/layout/',
		];

		let hasDisclaimer = false;
		layoutFiles.forEach(file => {
			if (fs.existsSync(file)) {
				const content = fs.readFileSync(file, 'utf8');
				if (content.includes('disclaimer') || content.includes('medical')) {
					hasDisclaimer = true;
				}
			}
		});

		if (hasDisclaimer) {
			complianceChecks.medicalDisclaimer = true;
			console.log('  ✅ Medical disclaimer present');
		} else {
			console.warn('  ⚠️  Medical disclaimer might be missing');
		}
	} catch (error) {
		console.error('  ❌ Error checking medical disclaimer:', error.message);
	}

	// Check data protection
	try {
		const nextConfig = fs.readFileSync('next.config.js', 'utf8');
		if (nextConfig.includes('X-Medical-Data-Protection')) {
			complianceChecks.dataProtection = true;
			console.log('  ✅ Medical data protection headers configured');
		} else {
			console.error('  ❌ Medical data protection not configured');
		}
	} catch (error) {
		console.error('  ❌ Error checking data protection:', error.message);
	}

	// Check evidence-based content structure
	try {
		const evidenceFiles = [
			'src/data/supplements/enhanced/',
			'src/lib/services/cross-referencing-engine.ts',
		];

		let evidenceBased = false;
		evidenceFiles.forEach(file => {
			if (fs.existsSync(file)) {
				evidenceBased = true;
			}
		});

		if (evidenceBased) {
			complianceChecks.evidenceBasedContent = true;
			console.log('  ✅ Evidence-based content structure present');
		} else {
			console.warn('  ⚠️  Evidence-based content structure incomplete');
		}
	} catch (error) {
		console.error('  ❌ Error checking evidence-based content:', error.message);
	}

	// Check security headers
	try {
		const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
		if (vercelConfig.headers && vercelConfig.headers.length > 0) {
			complianceChecks.securityHeaders = true;
			console.log('  ✅ Security headers configured');
		} else {
			console.error('  ❌ Security headers not configured');
		}
	} catch (error) {
		console.error('  ❌ Error checking security headers:', error.message);
	}

	const allCompliant = Object.values(complianceChecks).every(check => check);

	if (allCompliant) {
		console.log('✅ Medical compliance validation passed');
		return true;
	} else {
		console.log('❌ Medical compliance validation failed');
		Object.entries(complianceChecks).forEach(([check, passed]) => {
			if (!passed) {
				console.log(`  ❌ ${check} failed`);
			}
		});
		return false;
	}
}

/**
 * Validates deployment environment
 */
function validateDeploymentEnvironment() {
	console.log('🌍 Validating deployment environment...');

	const requiredEnvVars = [
		'DATABASE_URL',
		'NEXTAUTH_SECRET',
		'NEXTAUTH_URL',
		'MEDICAL_DATA_PROTECTION',
		'GDPR_COMPLIANCE_MODE',
	];

	const envValidation = {
		production: false,
		medical: false,
		security: false,
	};

	// Check production environment variables
	try {
		const prodEnv = fs.readFileSync('.env.production', 'utf8');
		const prodVars = prodEnv.split('\n').filter(line => line.includes('='));

		const foundVars = prodVars.map(line => line.split('=')[0]);

		if (requiredEnvVars.every(envVar => foundVars.includes(envVar))) {
			envValidation.production = true;
			console.log('  ✅ Production environment variables configured');
		} else {
			console.error('  ❌ Missing required environment variables');
		}
	} catch (error) {
		console.error('  ❌ Error checking production environment:', error.message);
	}

	// Check medical-specific variables
	try {
		const prodEnv = fs.readFileSync('.env.production', 'utf8');
		if (prodEnv.includes('MEDICAL_DATA_PROTECTION=enabled') &&
		    prodEnv.includes('GDPR_COMPLIANCE_MODE=strict')) {
			envValidation.medical = true;
			console.log('  ✅ Medical environment variables configured');
		} else {
			console.error('  ❌ Medical environment variables not properly set');
		}
	} catch (error) {
		console.error('  ❌ Error checking medical environment variables:', error.message);
	}

	// Check security settings
	try {
		const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
		if (vercelConfig.env && vercelConfig.env.NODE_ENV === 'production') {
			envValidation.security = true;
			console.log('  ✅ Security environment configured');
		} else {
			console.error('  ❌ Security environment not configured');
		}
	} catch (error) {
		console.error('  ❌ Error checking security environment:', error.message);
	}

	return Object.values(envValidation).every(valid => valid);
}

/**
 * Runs final deployment checks
 */
function runDeploymentChecks() {
	console.log('🚢 Running final deployment checks...');

	const checks = {
		medicalCompliance: validateMedicalCompliance(),
		deploymentEnvironment: validateDeploymentEnvironment(),
		buildVerification: false,
		securityAudit: false,
	};

	// Run build verification
	try {
		console.log('  🔨 Running build verification...');
		execSync('npm run production:verify', {
			stdio: 'pipe',
			timeout: 300000 // 5 minutes
		});
		checks.buildVerification = true;
		console.log('  ✅ Build verification passed');
	} catch (error) {
		console.error('  ❌ Build verification failed:', error.message);
	}

	// Run security audit
	try {
		console.log('  🔒 Running security audit...');
		execSync('npm run audit:security', {
			stdio: 'pipe',
			timeout: 60000 // 1 minute
		});
		checks.securityAudit = true;
		console.log('  ✅ Security audit passed');
	} catch (error) {
		console.error('  ❌ Security audit failed:', error.message);
	}

	return Object.values(checks).every(check => check);
}

/**
 * Performs deployment
 */
function performDeployment() {
	console.log('🚀 Starting deployment process...');

	try {
		// Pre-deployment checks
		if (!runDeploymentChecks()) {
			console.error('❌ Pre-deployment checks failed. Aborting deployment.');
			process.exit(1);
		}

		console.log('✅ All pre-deployment checks passed');

		// Build the application
		console.log('🔨 Building application...');
		execSync('npm run build:production', {
			stdio: 'inherit',
			timeout: 600000 // 10 minutes
		});

		// Deploy to Vercel
		console.log('🌐 Deploying to Vercel...');
		execSync('npm run vercel-deploy', {
			stdio: 'inherit',
			timeout: 300000 // 5 minutes
		});

		console.log('✅ Deployment completed successfully');

		// Post-deployment verification
		console.log('🔍 Running post-deployment verification...');
		execSync('npm run verify:deployment', {
			stdio: 'inherit',
			timeout: 120000 // 2 minutes
		});

		console.log('🎉 Medical app deployment completed successfully!');

	} catch (error) {
		console.error('❌ Deployment failed:', error.message);
		console.error('\n💡 Troubleshooting tips:');
		console.error('  • Check environment variables');
		console.error('  • Verify medical compliance settings');
		console.error('  • Review build logs for errors');
		console.error('  • Ensure all dependencies are installed');

		process.exit(1);
	}
}

/**
 * Main deployment function
 */
function runMedicalDeployment() {
	console.log('🏥 Starting medical app deployment for Suplementor');
	console.log('=' .repeat(60));

	console.log('📋 DEPLOYMENT CHECKLIST');
	console.log('□ Medical compliance validation');
	console.log('□ Environment configuration');
	console.log('□ Build optimization');
	console.log('□ Security audit');
	console.log('□ Production verification');
	console.log('□ Deployment execution');
	console.log('□ Post-deployment testing');

	console.log('\n🚀 Beginning deployment process...\n');

	performDeployment();
}

// Run deployment if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	runMedicalDeployment();
}

export { validateMedicalCompliance, validateDeploymentEnvironment, runDeploymentChecks };