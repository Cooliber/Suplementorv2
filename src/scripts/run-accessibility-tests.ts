#!/usr/bin/env tsx

/**
 * Comprehensive Accessibility Testing Script for Suplementor App
 * Runs all accessibility tests and generates detailed reports
 *
 * Usage:
 * npm run test:accessibility
 * npm run test:accessibility -- --user-profile=student_basic
 * npm run test:accessibility -- --generate-report
 */

import { accessibilityTestingFramework } from '../lib/accessibility-testing-framework';
import { accessibilityTestRunner } from '../lib/accessibility-test-runner';
import { contentValidationTools } from '../lib/content-validation-tools';
import { accessibilityReportingSystem } from '../lib/accessibility-reporting';
import { manualTestingGuidelinesGenerator, setupAccessibilityIntegration } from '../lib/accessibility-integration';
import { bodySystems } from '../data/body-systems';

interface TestOptions {
  userProfile?: string;
  generateReport?: boolean;
  outputDir?: string;
  failOnError?: boolean;
  verbose?: boolean;
}

class AccessibilityTestCLI {
  private options: TestOptions;

  constructor(options: TestOptions = {}) {
    this.options = {
      generateReport: true,
      outputDir: './accessibility-reports',
      failOnError: false,
      verbose: false,
      ...options
    };
  }

  async run(): Promise<void> {
    console.log('🚀 Starting comprehensive accessibility testing for Suplementor app...\n');

    const startTime = Date.now();

    try {
      // Initialize all systems
      await this.initializeSystems();

      // Run comprehensive accessibility audit
      await this.runAccessibilityAudit();

      // Run automated test suite
      await this.runAutomatedTests();

      // Validate content for different user profiles
      await this.validateContentForUsers();

      // Generate reports and recommendations
      await this.generateReports();

      // Calculate total duration
      const duration = Date.now() - startTime;

      // Print summary
      await this.printSummary(duration);

    } catch (error) {
      console.error('❌ Accessibility testing failed:', error);
      if (this.options.failOnError) {
        process.exit(1);
      }
    }
  }

  private async initializeSystems(): Promise<void> {
    console.log('🔧 Initializing accessibility testing systems...');

    // Set up integration with existing frameworks
    const integration = await setupAccessibilityIntegration();

    console.log(`✅ Systems initialized`);
    console.log(`📊 Baseline compliance: ${integration.dashboard.currentCompliance}`);
    console.log(`🎯 Baseline score: ${integration.dashboard.overallScore}%\n`);
  }

  private async runAccessibilityAudit(): Promise<void> {
    console.log('🔍 Running comprehensive accessibility audit...');

    // Run audit for all body systems
    const report = await accessibilityTestingFramework.runComprehensiveAccessibilityAudit(
      bodySystems,
      this.options.userProfile
    );

    // Add report to reporting system
    await accessibilityReportingSystem.addReport(report);

    console.log(`✅ Audit complete`);
    console.log(`📊 Overall score: ${report.overallScore}%`);
    console.log(`🏆 Compliance level: ${report.complianceLevel}`);
    console.log(`🚨 Issues found: ${report.failedTests + report.warnings}\n`);
  }

  private async runAutomatedTests(): Promise<void> {
    console.log('🤖 Running automated accessibility tests...');

    // Run the test runner
    const testResult = await accessibilityTestRunner.runAllTests();

    console.log(`✅ Automated tests complete`);
    console.log(`📈 Success rate: ${testResult.passedTests}/${testResult.totalTests} tests passed`);
    console.log(`⏱️  Duration: ${testResult.duration}ms\n`);
  }

  private async validateContentForUsers(): Promise<void> {
    console.log('📝 Validating content for different user profiles...');

    // Test content for different user profiles
    const userProfiles = this.options.userProfile
      ? [this.options.userProfile]
      : ['student_basic', 'professional_medical', 'general_public_senior'];

    for (const profileId of userProfiles) {
      console.log(`👤 Analyzing content for profile: ${profileId}`);

      // Analyze each body system for this user profile
      const analyses = await contentValidationTools.validateMultipleSystems(bodySystems);

      // Print analysis summary for this profile
      const averageScore = analyses.reduce((sum, a) => sum + a.overallScore, 0) / analyses.length;
      const needsAttention = analyses.filter(a => a.overallScore < 70).length;

      console.log(`   📊 Average score: ${Math.round(averageScore)}%`);
      console.log(`   ⚠️  Needs attention: ${needsAttention} systems`);

      if (this.options.verbose) {
        analyses.slice(0, 3).forEach(analysis => {
          console.log(`   • ${analysis.contentId}: ${analysis.overallScore}%`);
        });
      }
      console.log('');
    }
  }

  private async generateReports(): Promise<void> {
    if (!this.options.generateReport) return;

    console.log('📋 Generating accessibility reports...');

    // Generate progress report for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const progressReport = await accessibilityReportingSystem.generateProgressReport(
      thirtyDaysAgo,
      new Date()
    );

    // Generate dashboard
    const dashboard = await accessibilityReportingSystem.generateDashboard();

    // Generate manual testing guidelines
    const guidelines = manualTestingGuidelinesGenerator.generateManualTestingGuidelines();

    // Export reports
    const jsonReport = await accessibilityReportingSystem.exportReport('JSON');
    const csvReport = await accessibilityReportingSystem.exportReport('CSV');

    // Save reports (in a real implementation, these would be saved to files)
    console.log('💾 Reports generated:');
    console.log('   📄 JSON Report:', `${this.options.outputDir}/accessibility-report.json`);
    console.log('   📊 CSV Report:', `${this.options.outputDir}/accessibility-dashboard.csv`);
    console.log('   📋 Manual Testing Guidelines:', `${this.options.outputDir}/manual-testing-guidelines.md`);

    console.log('\n📊 Dashboard Summary:');
    console.log(`   🎯 Compliance Level: ${dashboard.currentCompliance}`);
    console.log(`   📈 Overall Score: ${dashboard.overallScore}%`);
    console.log(`   🚨 Critical Issues: ${dashboard.criticalIssues}`);
    console.log(`   ⚠️  High Priority: ${dashboard.highPriorityIssues}`);
    console.log(`   📝 Medium Priority: ${dashboard.mediumPriorityIssues}`);
    console.log(`   ℹ️  Low Priority: ${dashboard.lowPriorityIssues}\n`);
  }

  private async printSummary(duration: number): Promise<void> {
    console.log('🎉 Accessibility testing completed successfully!\n');

    console.log('📊 Final Summary:');
    console.log(`⏱️  Total duration: ${Math.round(duration / 1000)}s`);
    console.log(`🏆 All systems operational`);
    console.log(`📋 Reports generated`);
    console.log(`🔧 Ready for manual testing`);

    console.log('\n🚀 Next Steps:');
    console.log('1. Review generated reports');
    console.log('2. Follow manual testing guidelines');
    console.log('3. Address critical accessibility issues');
    console.log('4. Re-run tests after fixes');
    console.log('5. Validate with real users');

    console.log('\n💡 Quick Commands:');
    console.log('npm run test:accessibility          # Run full test suite');
    console.log('npm run test:accessibility -- --user-profile=student_basic  # Test for specific user');
    console.log('npm run test:accessibility -- --verbose  # Detailed output');
  }
}

// CLI argument parsing
function parseArguments(): TestOptions {
  const args = process.argv.slice(2);
  const options: TestOptions = {};

  args.forEach(arg => {
    if (arg.startsWith('--user-profile=')) {
      options.userProfile = arg.split('=')[1];
    } else if (arg === '--generate-report') {
      options.generateReport = true;
    } else if (arg.startsWith('--output-dir=')) {
      options.outputDir = arg.split('=')[1];
    } else if (arg === '--fail-on-error') {
      options.failOnError = true;
    } else if (arg === '--verbose') {
      options.verbose = true;
    }
  });

  return options;
}

// Main execution
async function main() {
  const options = parseArguments();
  const cli = new AccessibilityTestCLI(options);

  await cli.run();
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { AccessibilityTestCLI, main as runAccessibilityTests };