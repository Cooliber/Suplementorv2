#!/usr/bin/env node

/**
 * Deployment Monitoring Script
 * Monitors deployment status and provides rollback capabilities
 */

import https from 'https';
import http from 'http';

class DeploymentMonitor {
  constructor() {
    this.deploymentUrl = process.env.VERCEL_URL || 'https://suplementor.vercel.app';
    this.healthCheckUrl = `${this.deploymentUrl}/api/health`;
    this.checkInterval = 30000; // 30 seconds
    this.maxChecks = 20; // Maximum number of health checks
  }

  // Make HTTP request
  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;

      const req = protocol.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = {
              statusCode: res.statusCode,
              headers: res.headers,
              body: JSON.parse(data),
            };
            resolve(response);
          } catch (error) {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: data,
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  // Check deployment health
  async checkHealth() {
    try {
      console.log(`🔍 Checking deployment health at ${this.healthCheckUrl}`);

      const response = await this.makeRequest(this.healthCheckUrl);

      if (response.statusCode === 200) {
        console.log('✅ Deployment is healthy');
        console.log(`📊 Status: ${response.body.status}`);
        console.log(`⏱️ Response time: ${response.headers['x-response-time'] || 'N/A'}`);
        console.log(`🌍 Environment: ${response.body.environment}`);
        console.log(`📦 Version: ${response.body.version}`);

        return {
          healthy: true,
          status: response.body.status,
          details: response.body,
        };
      } else {
        console.log(`❌ Deployment health check failed: ${response.statusCode}`);
        return {
          healthy: false,
          statusCode: response.statusCode,
          error: response.body,
        };
      }
    } catch (error) {
      console.log(`❌ Health check error: ${error.message}`);
      return {
        healthy: false,
        error: error.message,
      };
    }
  }

  // Monitor deployment continuously
  async monitorDeployment() {
    console.log('🚀 Starting deployment monitoring...');
    console.log(`📍 Monitoring URL: ${this.deploymentUrl}`);
    console.log(`⏱️ Check interval: ${this.checkInterval / 1000}s`);
    console.log(`🔄 Max checks: ${this.maxChecks}`);

    let checkCount = 0;
    let healthyCount = 0;
    let firstHealthyTime = null;

    const monitorInterval = setInterval(async () => {
      checkCount++;

      const healthResult = await this.checkHealth();

      if (healthResult.healthy) {
        healthyCount++;
        if (!firstHealthyTime) {
          firstHealthyTime = new Date();
          console.log(`🎯 First healthy response at: ${firstHealthyTime.toISOString()}`);
        }

        // If deployment is consistently healthy, we can stop monitoring
        if (healthyCount >= 3) {
          console.log('🎉 Deployment is stable and healthy!');
          console.log(`📈 Success rate: ${healthyCount}/${checkCount} (${Math.round(healthyCount/checkCount*100)}%)`);
          clearInterval(monitorInterval);
          return;
        }
      } else {
        healthyCount = 0; // Reset healthy count on failure
        console.log(`❌ Health check ${checkCount} failed: ${healthResult.error}`);
      }

      // Stop monitoring after max checks
      if (checkCount >= this.maxChecks) {
        console.log(`🔄 Monitoring completed after ${this.maxChecks} checks`);
        console.log(`📊 Final success rate: ${healthyCount}/${checkCount} (${Math.round(healthyCount/checkCount*100)}%)`);

        if (healthyCount === 0) {
          console.log('💥 Deployment appears to be failing consistently');
          console.log('🔧 Consider rolling back or checking deployment logs');
        } else if (healthyCount < checkCount * 0.8) {
          console.log('⚠️ Deployment has intermittent issues');
          console.log('🔍 Check application logs for more details');
        }

        clearInterval(monitorInterval);
      }
    }, this.checkInterval);

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping deployment monitor...');
      clearInterval(monitorInterval);
      process.exit(0);
    });
  }

  // Rollback deployment (placeholder - would need Vercel API integration)
  async rollbackDeployment(targetVersion) {
    console.log('🔄 Rolling back deployment...');

    try {
      // This would integrate with Vercel API to rollback
      console.log(`🎯 Rolling back to version: ${targetVersion}`);
      console.log('⚠️ Rollback functionality requires Vercel API token');

      return {
        success: false,
        message: 'Rollback requires Vercel API integration',
      };
    } catch (error) {
      console.error('❌ Rollback failed:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get deployment information
  async getDeploymentInfo() {
    console.log('📋 Getting deployment information...');

    try {
      const response = await this.makeRequest(`${this.deploymentUrl}/api/health`);

      if (response.statusCode === 200) {
        const info = response.body;
        console.log('📊 Deployment Information:');
        console.log(`   Status: ${info.status}`);
        console.log(`   Version: ${info.version}`);
        console.log(`   Environment: ${info.environment}`);
        console.log(`   Uptime: ${Math.round(info.uptime)}s`);
        console.log(`   Timestamp: ${info.timestamp}`);

        if (info.checks) {
          console.log('🔍 Health Checks:');
          Object.entries(info.checks).forEach(([check, result]) => {
            const status = result.status === 'ok' ? '✅' : '❌';
            console.log(`   ${status} ${check}: ${result.message || 'OK'}`);
          });
        }

        return info;
      } else {
        console.log(`❌ Cannot get deployment info: ${response.statusCode}`);
        return null;
      }
    } catch (error) {
      console.log(`❌ Error getting deployment info: ${error.message}`);
      return null;
    }
  }

  // Performance monitoring
  async monitorPerformance() {
    console.log('⚡ Starting performance monitoring...');

    const metrics = {
      responseTimes: [],
      statusCodes: [],
      errors: [],
    };

    const duration = 5 * 60 * 1000; // 5 minutes
    const startTime = Date.now();

    while (Date.now() - startTime < duration) {
      try {
        const requestStart = Date.now();
        const response = await this.makeRequest(this.healthCheckUrl);
        const responseTime = Date.now() - requestStart;

        metrics.responseTimes.push(responseTime);
        metrics.statusCodes.push(response.statusCode);

        if (response.statusCode !== 200) {
          metrics.errors.push({
            statusCode: response.statusCode,
            timestamp: new Date().toISOString(),
          });
        }

        // Wait 10 seconds between checks
        await new Promise(resolve => setTimeout(resolve, 10000));
      } catch (error) {
        metrics.errors.push({
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    // Calculate performance metrics
    const avgResponseTime = metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length;
    const successRate = (metrics.statusCodes.filter(code => code === 200).length / metrics.statusCodes.length) * 100;

    console.log('\n📊 Performance Summary:');
    console.log(`   Average response time: ${Math.round(avgResponseTime)}ms`);
    console.log(`   Success rate: ${Math.round(successRate)}%`);
    console.log(`   Total requests: ${metrics.responseTimes.length}`);
    console.log(`   Errors: ${metrics.errors.length}`);

    return metrics;
  }
}

// CLI interface
async function main() {
  const monitor = new DeploymentMonitor();

  const command = process.argv[2];

  switch (command) {
    case 'health':
      await monitor.checkHealth();
      break;

    case 'monitor':
      await monitor.monitorDeployment();
      break;

    case 'info':
      await monitor.getDeploymentInfo();
      break;

    case 'performance':
      await monitor.monitorPerformance();
      break;

    case 'rollback':
      const version = process.argv[3];
      if (!version) {
        console.log('❌ Please provide a version to rollback to');
        process.exit(1);
      }
      await monitor.rollbackDeployment(version);
      break;

    default:
      console.log('🚀 Deployment Monitor');
      console.log('');
      console.log('Usage: node deployment-monitor.js <command>');
      console.log('');
      console.log('Commands:');
      console.log('  health      - Check deployment health once');
      console.log('  monitor     - Monitor deployment continuously');
      console.log('  info        - Get deployment information');
      console.log('  performance - Monitor performance for 5 minutes');
      console.log('  rollback    - Rollback to specific version');
      console.log('');
      console.log('Examples:');
      console.log('  node deployment-monitor.js health');
      console.log('  node deployment-monitor.js monitor');
      console.log('  node deployment-monitor.js rollback v1.0.0');
      break;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default DeploymentMonitor;