#!/usr/bin/env bun

/**
 * Bun API Testing Script
 * Demonstrates Bun 1.3's HTTP client capabilities
 * Tests the Suplementor API endpoints
 */

const BASE_URL = "http://localhost:3000";
const API_ENDPOINTS = [
  "/api/health",
  "/api/supplements?limit=5",
  "/api/brain-regions?limit=3",
  "/api/supplements/categories",
];

interface TestResult {
  endpoint: string;
  status: number;
  responseTime: number;
  success: boolean;
  error?: string;
  dataSize?: number;
}

async function testEndpoint(endpoint: string): Promise<TestResult> {
  const startTime = performance.now();

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Bun-API-Test/1.3.0"
      }
    });

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    const data = await response.text();
    const dataSize = new TextEncoder().encode(data).length;

    return {
      endpoint,
      status: response.status,
      responseTime: Math.round(responseTime * 100) / 100,
      success: response.ok,
      dataSize
    };

  } catch (error) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    return {
      endpoint,
      status: 0,
      responseTime: Math.round(responseTime * 100) / 100,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

async function runAPITests() {
  console.log("🚀 Bun 1.3 API Testing Suite");
  console.log("═".repeat(50));
  console.log(`📍 Target: ${BASE_URL}`);
  console.log(`⚡ Runtime: Bun ${Bun.version}`);
  console.log(`🕒 Started: ${new Date().toISOString()}`);
  console.log("");

  const results: TestResult[] = [];
  let totalTime = 0;

  for (const endpoint of API_ENDPOINTS) {
    console.log(`🔍 Testing ${endpoint}...`);
    const result = await testEndpoint(endpoint);
    results.push(result);
    totalTime += result.responseTime;

    if (result.success) {
      console.log(`  ✅ ${result.status} - ${result.responseTime}ms - ${result.dataSize} bytes`);
    } else {
      console.log(`  ❌ ${result.status} - ${result.responseTime}ms - ${result.error}`);
    }
  }

  console.log("");
  console.log("📊 Test Results Summary");
  console.log("═".repeat(50));

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const avgResponseTime = totalTime / results.length;

  console.log(`Total Tests: ${results.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
  console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`Total Time: ${totalTime.toFixed(2)}ms`);

  // Performance analysis
  console.log("");
  console.log("⚡ Performance Analysis");
  console.log("═".repeat(50));

  const responseTimes = results.map(r => r.responseTime).sort((a, b) => a - b);
  const median = responseTimes[Math.floor(responseTimes.length / 2)];
  const p95 = responseTimes[Math.floor(responseTimes.length * 0.95)];

  console.log(`Median Response Time: ${median.toFixed(2)}ms`);
  console.log(`95th Percentile: ${p95.toFixed(2)}ms`);
  console.log(`Fastest: ${Math.min(...responseTimes).toFixed(2)}ms`);
  console.log(`Slowest: ${Math.max(...responseTimes).toFixed(2)}ms`);

  // Memory usage
  const memUsage = process.memoryUsage();
  console.log("");
  console.log("🧠 Memory Usage");
  console.log("═".repeat(50));
  console.log(`RSS: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Heap Used: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Heap Total: ${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`External: ${(memUsage.external / 1024 / 1024).toFixed(2)} MB`);

  console.log("");
  console.log("🎉 API Testing Complete!");
  console.log("💡 Bun 1.3 provides excellent HTTP client performance");

  // Save results to JSON file
  const testReport = {
    timestamp: new Date().toISOString(),
    runtime: `Bun ${Bun.version}`,
    target: BASE_URL,
    summary: {
      totalTests: results.length,
      successful,
      failed,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      totalTime: Math.round(totalTime * 100) / 100,
      medianResponseTime: Math.round(median * 100) / 100,
      p95ResponseTime: Math.round(p95 * 100) / 100
    },
    results,
    memoryUsage: {
      rss: memUsage.rss,
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external
    }
  };

  await Bun.write("api-test-results.json", JSON.stringify(testReport, null, 2));
  console.log("📄 Test results saved to: api-test-results.json");

  return results.every(r => r.success);
}

// Check if server is running
async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      timeout: 5000 // 5 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log("🔍 Checking if server is running...");

  const serverHealthy = await checkServerHealth();

  if (!serverHealthy) {
    console.log("❌ Server is not running at", BASE_URL);
    console.log("💡 Start the development server first:");
    console.log("   bun run dev");
    console.log("");
    console.log("🔄 Starting tests anyway (expecting failures)...");
  } else {
    console.log("✅ Server is running and healthy");
  }

  const success = await runAPITests();
  process.exit(success ? 0 : 1);
}

main().catch(console.error);
