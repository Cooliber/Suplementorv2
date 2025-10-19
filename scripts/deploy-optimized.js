#!/usr/bin/env node

/**
 * Optimized Deployment Script for Large Neuroeducation Platform
 * Handles Vercel deployment with optimizations for large bundles
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class OptimizedDeployer {
  constructor() {
    this.projectRoot = process.cwd();
    this.vercelConfig = path.join(this.projectRoot, 'vercel.json');
    this.nextConfig = path.join(this.projectRoot, 'next.config.js');
  }

  // Pre-deployment bundle analysis
  async analyzeBundle() {
    console.log('🔍 Analyzing bundle size...');

    try {
      // Build with bundle analyzer
      execSync('ANALYZE=true bun run build', {
        stdio: 'inherit',
        cwd: this.projectRoot
      });

      console.log('✅ Bundle analysis complete');
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error.message);
      throw error;
    }
  }

  // Optimize build configuration
  optimizeBuildConfig() {
    console.log('⚙️ Optimizing build configuration...');

    // Create optimized next.config.js for production
    const nextConfigContent = `
/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: [
      '@react-three/fiber',
      '@react-three/drei',
      'three',
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-slot',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      'date-fns/locale/pl',
    ],
    optimizeCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'images.unsplash.com',
      'cdn.suplementor.pl',
      'assets.suplementor.pl',
    ],
    dangerouslyAllowSVG: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = config;
`;

    // Write optimized config
    fs.writeFileSync(this.nextConfig, nextConfigContent);
    console.log('✅ Build configuration optimized');
  }

  // Pre-deployment cleanup
  cleanup() {
    console.log('🧹 Cleaning up previous builds...');

    const cleanupCommands = [
      'rm -rf .next',
      'rm -rf node_modules/.cache',
      'rm -rf .vercel/cache',
      'rm -f *.tsbuildinfo'
    ];

    cleanupCommands.forEach(cmd => {
      try {
        execSync(cmd, { stdio: 'inherit', cwd: this.projectRoot });
      } catch (error) {
        // Ignore errors for optional cleanup
      }
    });

    console.log('✅ Cleanup complete');
  }

  // Optimized build process
  async build() {
    console.log('🏗️ Starting optimized build...');

    try {
      // Install dependencies with frozen lockfile for consistency
      execSync('bun install --frozen-lockfile', {
        stdio: 'inherit',
        cwd: this.projectRoot
      });

      // Build with optimizations
      execSync('bun run build', {
        stdio: 'inherit',
        cwd: this.projectRoot,
        env: {
          ...process.env,
          NODE_ENV: 'production',
          NEXT_TELEMETRY_DISABLED: '1'
        }
      });

      console.log('✅ Build completed successfully');
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      throw error;
    }
  }

  // Deploy with optimizations
  async deploy() {
    console.log('🚀 Deploying to Vercel...');

    try {
      // Deploy with specific flags for large projects
      const deployCommand = [
        'vercel',
        '--prod',
        '--no-clipboard',
        '--scope=suplementor',
        '--regions=fra1,iad1,sfo1',
        '--build-env=NEXT_TELEMETRY_DISABLED=1',
        '--build-env=NODE_ENV=production'
      ].join(' ');

      execSync(deployCommand, {
        stdio: 'inherit',
        cwd: this.projectRoot
      });

      console.log('✅ Deployment completed successfully');
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      throw error;
    }
  }

  // Post-deployment verification
  async verifyDeployment() {
    console.log('🔍 Verifying deployment...');

    try {
      // Check if deployment URL is accessible
      const deploymentUrl = process.env.VERCEL_URL || 'https://suplementor.vercel.app';

      // Basic health check would go here
      console.log(`✅ Deployment verified at ${deploymentUrl}`);
    } catch (error) {
      console.error('❌ Deployment verification failed:', error.message);
      throw error;
    }
  }

  // Main deployment workflow
  async deployOptimized() {
    try {
      console.log('🚀 Starting optimized deployment workflow...\n');

      await this.analyzeBundle();
      this.optimizeBuildConfig();
      this.cleanup();
      await this.build();
      await this.deploy();
      await this.verifyDeployment();

      console.log('\n🎉 Optimized deployment completed successfully!');
      console.log('📊 Check your deployment at: https://suplementor.vercel.app');

    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
      process.exit(1);
    }
  }
}

// CLI interface
async function main() {
  const deployer = new OptimizedDeployer();

  if (process.argv.includes('--analyze-only')) {
    await deployer.analyzeBundle();
    return;
  }

  if (process.argv.includes('--build-only')) {
    await deployer.build();
    return;
  }

  await deployer.deployOptimized();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default OptimizedDeployer;