#!/usr/bin/env node

/**
 * Deployment Debugging Script for Vercel Deployments
 * Analyzes and troubleshoots deployment issues for large projects
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class DeploymentDebugger {
  constructor() {
    this.projectRoot = process.cwd();
    this.vercelConfig = path.join(this.projectRoot, 'vercel.json');
    this.nextConfig = path.join(this.projectRoot, 'next.config.js');
    this.packageJson = path.join(this.projectRoot, 'package.json');
  }

  // Check project configuration
  checkConfiguration() {
    console.log('🔧 Checking project configuration...\n');

    const issues = [];

    // Check if vercel.json exists
    if (!fs.existsSync(this.vercelConfig)) {
      issues.push('❌ vercel.json not found');
    } else {
      console.log('✅ vercel.json found');
    }

    // Check if package.json exists
    if (!fs.existsSync(this.packageJson)) {
      issues.push('❌ package.json not found');
    } else {
      console.log('✅ package.json found');
    }

    // Check if next.config.js exists
    if (!fs.existsSync(this.nextConfig)) {
      issues.push('❌ next.config.js not found');
    } else {
      console.log('✅ next.config.js found');
    }

    // Check bundle size
    try {
      const stats = fs.statSync(path.join(this.projectRoot, '.next'));
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`📦 Bundle size: ${sizeMB} MB`);

      if (stats.size > 50 * 1024 * 1024) { // 50MB
        issues.push('⚠️ Bundle size exceeds 50MB - may cause deployment issues');
      }
    } catch (error) {
      issues.push('❌ Cannot analyze bundle size - build first');
    }

    return issues;
  }

  // Check dependencies
  checkDependencies() {
    console.log('\n📋 Checking dependencies...\n');

    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packageJson, 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      const largeDependencies = [];
      const issues = [];

      // Check for large dependencies
      Object.entries(dependencies).forEach(([name, version]) => {
        // This is a simplified check - in reality you'd check actual node_modules size
        if (['three', '@react-three/fiber', '@react-three/drei', 'cytoscape', 'd3'].includes(name)) {
          largeDependencies.push(`${name}@${version}`);
        }
      });

      if (largeDependencies.length > 0) {
        console.log('📚 Large dependencies detected:');
        largeDependencies.forEach(dep => console.log(`   - ${dep}`));
        console.log('   These may contribute to large bundle size');
      }

      return issues;
    } catch (error) {
      return ['❌ Cannot read package.json'];
    }
  }

  // Check environment variables
  checkEnvironment() {
    console.log('\n🌍 Checking environment configuration...\n');

    const issues = [];
    const requiredEnvVars = [
      'MONGODB_URI',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ];

    requiredEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        issues.push(`⚠️ Missing environment variable: ${envVar}`);
      } else {
        console.log(`✅ ${envVar} is set`);
      }
    });

    return issues;
  }

  // Analyze build output
  analyzeBuild() {
    console.log('\n🔍 Analyzing build output...\n');

    const issues = [];

    try {
      // Check if .next directory exists
      if (!fs.existsSync(path.join(this.projectRoot, '.next'))) {
        issues.push('❌ No build output found - run build first');
        return issues;
      }

      // Analyze static files
      const staticDir = path.join(this.projectRoot, '.next', 'static');
      if (fs.existsSync(staticDir)) {
        const files = this.getAllFiles(staticDir);
        const totalSize = files.reduce((total, file) => {
          try {
            return total + fs.statSync(file).size;
          } catch {
            return total;
          }
        }, 0);

        const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        console.log(`📁 Static files: ${files.length} files, ${sizeMB} MB`);

        // Check for large files
        const largeFiles = files.filter(file => {
          try {
            return fs.statSync(file).size > 5 * 1024 * 1024; // 5MB
          } catch {
            return false;
          }
        });

        if (largeFiles.length > 0) {
          console.log('⚠️ Large static files detected:');
          largeFiles.forEach(file => {
            const size = (fs.statSync(file).size / (1024 * 1024)).toFixed(2);
            console.log(`   - ${path.relative(staticDir, file)} (${size} MB)`);
          });
        }
      }

      return issues;
    } catch (error) {
      return [`❌ Error analyzing build: ${error.message}`];
    }
  }

  // Get all files recursively
  getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = this.getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });

    return arrayOfFiles;
  }

  // Check Vercel configuration
  checkVercelConfig() {
    console.log('\n⚙️ Checking Vercel configuration...\n');

    const issues = [];

    try {
      const vercelConfig = JSON.parse(fs.readFileSync(this.vercelConfig, 'utf8'));

      // Check for required fields
      if (!vercelConfig.buildCommand) {
        issues.push('❌ Missing buildCommand in vercel.json');
      } else {
        console.log(`✅ Build command: ${vercelConfig.buildCommand}`);
      }

      if (!vercelConfig.installCommand) {
        issues.push('❌ Missing installCommand in vercel.json');
      } else {
        console.log(`✅ Install command: ${vercelConfig.installCommand}`);
      }

      // Check function configurations
      if (vercelConfig.functions) {
        console.log('✅ Function configurations found');
        Object.entries(vercelConfig.functions).forEach(([pattern, config]) => {
          if (config.maxDuration) {
            console.log(`   - ${pattern}: maxDuration ${config.maxDuration}s`);
          }
          if (config.memory) {
            console.log(`   - ${pattern}: memory ${config.memory}MB`);
          }
        });
      }

      // Check for large file optimizations
      if (vercelConfig.maxLambdaSize) {
        console.log(`✅ Max lambda size: ${vercelConfig.maxLambdaSize}`);
      } else {
        issues.push('⚠️ Consider setting maxLambdaSize for large projects');
      }

    } catch (error) {
      issues.push(`❌ Cannot read vercel.json: ${error.message}`);
    }

    return issues;
  }

  // Generate optimization suggestions
  generateSuggestions(issues) {
    console.log('\n💡 Optimization Suggestions:\n');

    if (issues.length === 0) {
      console.log('✅ No issues found! Your deployment configuration looks good.');
      return;
    }

    const suggestions = {
      'Bundle size exceeds 50MB': [
        'Implement code splitting for large data files',
        'Use dynamic imports for heavy components',
        'Optimize 3D models and static assets',
        'Consider using Next.js Image optimization'
      ],
      'Missing environment variable': [
        'Set up all required environment variables',
        'Use Vercel CLI to pull environment variables',
        'Check .env files for completeness'
      ],
      'Large static files detected': [
        'Compress images and 3D models',
        'Use WebP/AVIF formats for images',
        'Implement lazy loading for media files',
        'Consider CDN for large assets'
      ],
      'No build output found': [
        'Run build locally first',
        'Check for build errors',
        'Verify all dependencies are installed'
      ]
    };

    issues.forEach(issue => {
      const suggestionsForIssue = suggestions[issue] || ['Review deployment configuration'];
      console.log(`📋 ${issue}:`);
      suggestionsForIssue.forEach(suggestion => {
        console.log(`   - ${suggestion}`);
      });
      console.log('');
    });
  }

  // Run all checks
  async runDiagnostics() {
    console.log('🚀 Starting deployment diagnostics...\n');

    const allIssues = [
      ...this.checkConfiguration(),
      ...this.checkDependencies(),
      ...this.checkEnvironment(),
      ...this.analyzeBuild(),
      ...this.checkVercelConfig()
    ];

    this.generateSuggestions(allIssues);

    console.log('\n📊 Summary:');
    console.log(`Found ${allIssues.length} potential issues`);

    if (allIssues.length === 0) {
      console.log('🎉 Your project is ready for deployment!');
    } else {
      console.log('⚠️ Please address the issues above before deploying.');
    }

    return allIssues;
  }
}

// CLI interface
async function main() {
  const deploymentDebugger = new DeploymentDebugger();

  if (process.argv.includes('--fix')) {
    console.log('🔧 Auto-fixing common issues...');
    // Auto-fix logic would go here
    return;
  }

  await deploymentDebugger.runDiagnostics();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default DeploymentDebugger;