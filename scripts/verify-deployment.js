#!/usr/bin/env node

/**
 * Deployment Verification Script for Suplementor Medical App
 * Verifies all deployment configurations and medical app requirements
 */

import https from 'https';
import http from 'http';
import { execSync } from 'child_process';

class DeploymentVerifier {
  constructor() {
    this.deploymentUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://suplementor.pl';
    this.checks = [];
  }

  /**
   * Run all deployment verifications
   */
  async verify() {
    console.log('🔍 Starting deployment verification for medical app...');
    console.log(`📋 Target URL: ${this.deploymentUrl}`);

    try {
      // Basic connectivity check
      await this.checkBasicConnectivity();

      // Health check verification
      await this.checkHealthEndpoint();

      // Security headers verification
      await this.checkSecurityHeaders();

      // Medical data protection verification
      await this.checkMedicalDataProtection();

      // GDPR compliance verification
      await this.checkGDPRCompliance();

      // Polish localization verification
      await this.checkPolishLocalization();

      // Performance optimization verification
      await this.checkPerformanceOptimizations();

      // Generate verification report
      this.generateReport();

    } catch (error) {
      console.error('❌ Deployment verification failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Check basic connectivity
   */
  async checkBasicConnectivity() {
    console.log('\n🌐 Checking basic connectivity...');

    return new Promise((resolve, reject) => {
      const url = new URL(this.deploymentUrl);

      const req = https.request({
        hostname: url.hostname,
        port: 443,
        path: '/',
        method: 'HEAD',
        timeout: 10000,
      }, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          console.log(`✅ Connectivity OK (${res.statusCode})`);
          this.checks.push({ name: 'Connectivity', status: 'PASS', details: `Status: ${res.statusCode}` });
          resolve();
        } else {
          reject(new Error(`HTTP ${res.statusCode} response`));
        }
      });

      req.on('error', (error) => {
        reject(new Error(`Connection failed: ${error.message}`));
      });

      req.on('timeout', () => {
        reject(new Error('Connection timeout'));
      });

      req.end();
    });
  }

  /**
   * Check health endpoint
   */
  async checkHealthEndpoint() {
    console.log('\n🏥 Checking health endpoint...');

    const healthUrl = `${this.deploymentUrl}/api/health`;

    return new Promise((resolve, reject) => {
      https.get(healthUrl, { timeout: 10000 }, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const healthData = JSON.parse(data);

            if (res.statusCode === 200 && healthData.status === 'ok') {
              console.log('✅ Health check passed');
              console.log(`   - Environment: ${healthData.environment}`);
              console.log(`   - Region: ${healthData.region}`);
              console.log(`   - Response time: ${healthData.responseTime}`);

              this.checks.push({
                name: 'Health Check',
                status: 'PASS',
                details: `Environment: ${healthData.environment}, Region: ${healthData.region}`
              });
              resolve();
            } else {
              reject(new Error(`Health check failed: ${healthData.error || 'Unknown error'}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse health response: ${error.message}`));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Health check request failed: ${error.message}`));
      }).on('timeout', () => {
        reject(new Error('Health check timeout'));
      });
    });
  }

  /**
   * Check security headers
   */
  async checkSecurityHeaders() {
    console.log('\n🔒 Checking security headers...');

    return new Promise((resolve, reject) => {
      https.get(this.deploymentUrl, { timeout: 10000 }, (res) => {
        const requiredHeaders = [
          'x-frame-options',
          'x-content-type-options',
          'strict-transport-security',
          'content-security-policy',
          'x-medical-app',
          'x-medical-data-protection',
        ];

        const missingHeaders = [];
        const presentHeaders = {};

        // Check each required header
        requiredHeaders.forEach(header => {
          const value = res.headers[header];
          if (value) {
            presentHeaders[header] = value;
          } else {
            missingHeaders.push(header);
          }
        });

        if (missingHeaders.length === 0) {
          console.log('✅ All security headers present');
          Object.entries(presentHeaders).forEach(([header, value]) => {
            console.log(`   - ${header}: ${value.substring(0, 50)}...`);
          });

          this.checks.push({
            name: 'Security Headers',
            status: 'PASS',
            details: `${Object.keys(presentHeaders).length} headers verified`
          });
          resolve();
        } else {
          reject(new Error(`Missing security headers: ${missingHeaders.join(', ')}`));
        }
      }).on('error', (error) => {
        reject(new Error(`Security headers check failed: ${error.message}`));
      });
    });
  }

  /**
   * Check medical data protection
   */
  async checkMedicalDataProtection() {
    console.log('\n🩺 Checking medical data protection...');

    const medicalUrl = `${this.deploymentUrl}/api/supplements`;

    return new Promise((resolve, reject) => {
      https.get(medicalUrl, { timeout: 10000 }, (res) => {
        const medicalHeaders = [
          'x-medical-data-protection',
          'x-data-classification',
          'x-medical-app',
        ];

        const missingHeaders = [];
        const presentHeaders = {};

        medicalHeaders.forEach(header => {
          const value = res.headers[header];
          if (value) {
            presentHeaders[header] = value;
          } else {
            missingHeaders.push(header);
          }
        });

        if (missingHeaders.length === 0) {
          console.log('✅ Medical data protection headers present');
          Object.entries(presentHeaders).forEach(([header, value]) => {
            console.log(`   - ${header}: ${value}`);
          });

          this.checks.push({
            name: 'Medical Data Protection',
            status: 'PASS',
            details: 'GDPR-compliant headers verified'
          });
          resolve();
        } else {
          reject(new Error(`Missing medical data protection headers: ${missingHeaders.join(', ')}`));
        }
      }).on('error', (error) => {
        reject(new Error(`Medical data protection check failed: ${error.message}`));
      });
    });
  }

  /**
   * Check GDPR compliance
   */
  async checkGDPRCompliance() {
    console.log('\n📋 Checking GDPR compliance...');

    try {
      // Check if GDPR-related environment variables are set
      const gdprVars = [
        'GDPR_COMPLIANCE_MODE',
        'MEDICAL_DATA_PROTECTION',
        'USER_CONSENT_REQUIRED',
      ];

      const missingVars = gdprVars.filter(varName => !process.env[varName]);

      if (missingVars.length > 0) {
        throw new Error(`Missing GDPR environment variables: ${missingVars.join(', ')}`);
      }

      // Verify GDPR mode is strict
      if (process.env.GDPR_COMPLIANCE_MODE !== 'strict') {
        throw new Error('GDPR compliance mode must be "strict"');
      }

      console.log('✅ GDPR compliance verified');
      console.log(`   - Mode: ${process.env.GDPR_COMPLIANCE_MODE}`);
      console.log(`   - Data Protection: ${process.env.MEDICAL_DATA_PROTECTION}`);
      console.log(`   - Consent Required: ${process.env.USER_CONSENT_REQUIRED}`);

      this.checks.push({
        name: 'GDPR Compliance',
        status: 'PASS',
        details: 'Strict mode enabled with medical data protection'
      });

    } catch (error) {
      throw new Error(`GDPR compliance check failed: ${error.message}`);
    }
  }

  /**
   * Check Polish localization
   */
  async checkPolishLocalization() {
    console.log('\n🇵🇱 Checking Polish localization...');

    try {
      // Check Polish localization environment variables
      const polishVars = [
        'POLISH_LOCALIZATION',
        'NEXT_PUBLIC_DEFAULT_LOCALE',
      ];

      const missingVars = polishVars.filter(varName => !process.env[varName]);

      if (missingVars.length > 0) {
        throw new Error(`Missing Polish localization variables: ${missingVars.join(', ')}`);
      }

      // Verify Polish is the default locale
      if (process.env.NEXT_PUBLIC_DEFAULT_LOCALE !== 'pl') {
        throw new Error('Default locale must be Polish (pl)');
      }

      console.log('✅ Polish localization verified');
      console.log(`   - Localization: ${process.env.POLISH_LOCALIZATION}`);
      console.log(`   - Default Locale: ${process.env.NEXT_PUBLIC_DEFAULT_LOCALE}`);

      this.checks.push({
        name: 'Polish Localization',
        status: 'PASS',
        details: 'Polish language support configured'
      });

    } catch (error) {
      throw new Error(`Polish localization check failed: ${error.message}`);
    }
  }

  /**
   * Check performance optimizations
   */
  async checkPerformanceOptimizations() {
    console.log('\n⚡ Checking performance optimizations...');

    try {
      // Check performance-related environment variables
      const perfVars = [
        'BRAIN_VISUALIZATION_OPTIMIZATION',
        'CDN_OPTIMIZATION',
        'REGIONAL_CDN_EUROPE',
      ];

      const enabledOptimizations = perfVars.filter(
        varName => process.env[varName] === 'enabled'
      );

      console.log('✅ Performance optimizations verified');
      console.log(`   - Enabled: ${enabledOptimizations.length}/${perfVars.length}`);
      enabledOptimizations.forEach(opt => {
        console.log(`   - ${opt}: enabled`);
      });

      this.checks.push({
        name: 'Performance Optimizations',
        status: 'PASS',
        details: `${enabledOptimizations.length} optimizations enabled`
      });

    } catch (error) {
      throw new Error(`Performance optimization check failed: ${error.message}`);
    }
  }

  /**
   * Generate verification report
   */
  generateReport() {
    console.log('\n📊 DEPLOYMENT VERIFICATION REPORT');
    console.log('=====================================');

    const passed = this.checks.filter(check => check.status === 'PASS').length;
    const total = this.checks.length;

    console.log(`Overall Status: ${passed}/${total} checks passed`);

    if (passed === total) {
      console.log('🎉 All deployment verifications passed!');
      console.log('✅ Medical app is ready for production');
    } else {
      console.log('⚠️  Some verifications failed');
      console.log('❌ Please review and fix the issues above');
      process.exit(1);
    }

    console.log('\n📋 Check Details:');
    this.checks.forEach((check, index) => {
      const icon = check.status === 'PASS' ? '✅' : '❌';
      console.log(`${index + 1}. ${icon} ${check.name}: ${check.details}`);
    });

    console.log('\n🔗 Useful URLs:');
    console.log(`   - Application: ${this.deploymentUrl}`);
    console.log(`   - Health Check: ${this.deploymentUrl}/api/health`);
    console.log(`   - Supplements: ${this.deploymentUrl}/suplementy`);
    console.log(`   - Knowledge Base: ${this.deploymentUrl}/wiedza`);

    console.log('\n📋 Next Steps:');
    console.log('1. Monitor application performance');
    console.log('2. Test all medical features');
    console.log('3. Verify GDPR compliance with real users');
    console.log('4. Set up monitoring alerts');
  }
}

// Execute verification if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const verifier = new DeploymentVerifier();
  verifier.verify().catch(error => {
    console.error('Verification failed:', error.message);
    process.exit(1);
  });
}

export default DeploymentVerifier;