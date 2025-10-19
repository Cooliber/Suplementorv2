/**
 * Comprehensive Performance Analysis for Suplementor
 *
 * Advanced performance monitoring, benchmarking, and optimization analysis
 * using Bun 1.3 capabilities and mathematical modeling
 */

import { Database } from 'bun:sqlite';

// Performance metrics interfaces
export interface PerformanceMetric {
  timestamp: number;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  userAgent?: string;
  connectionType?: string;
  memoryUsage?: number;
  cpuUsage?: number;
}

export interface BenchmarkResult {
  operation: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  p95Time: number;
  p99Time: number;
  throughput: number;
  memoryDelta: number;
}

export interface SystemHealth {
  database: {
    connections: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
  cache: {
    hitRate: number;
    size: number;
    evictions: number;
  };
  memory: {
    used: number;
    available: number;
    leakRate: number;
  };
  cpu: {
    usage: number;
    loadAverage: number;
  };
}

// Statistical analysis functions
export class StatisticalAnalyzer {
  static mean(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  static median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  static percentile(values: number[], p: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) return sorted[lower];

    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  static standardDeviation(values: number[]): number {
    const mean = this.mean(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return Math.sqrt(this.mean(squaredDiffs));
  }

  static confidenceInterval(values: number[], confidence = 0.95): [number, number] {
    const mean = this.mean(values);
    const std = this.standardDeviation(values);
    const n = values.length;
    const z = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.576 : 1.96;

    const margin = z * (std / Math.sqrt(n));
    return [mean - margin, mean + margin];
  }

  static trendAnalysis(values: number[]): {
    slope: number;
    intercept: number;
    rSquared: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  } {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = values.reduce((sum, yi) => sum + yi * yi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const yMean = sumY / n;
    const ssRes = values.reduce((sum, yi, i) => {
      const predicted = slope * x[i] + intercept;
      return sum + Math.pow(yi - predicted, 0);
    }, 0);
    const ssTot = values.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (Math.abs(slope) > 0.01) {
      trend = slope > 0 ? 'increasing' : 'decreasing';
    }

    return { slope, intercept, rSquared, trend };
  }
}

// Performance monitoring system
export class PerformanceMonitor {
  private db: Database;
  private metrics: PerformanceMetric[] = [];
  private memoryBaseline: number = 0;

  constructor(dbPath: string = './performance.db') {
    this.db = new Database(dbPath);
    this.initializeDatabase();
    this.memoryBaseline = process.memoryUsage?.()?.heapUsed || 0;
  }

  private initializeDatabase(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER,
        endpoint TEXT,
        method TEXT,
        response_time INTEGER,
        status_code INTEGER,
        user_agent TEXT,
        connection_type TEXT,
        memory_usage INTEGER,
        cpu_usage REAL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS benchmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operation TEXT,
        iterations INTEGER,
        total_time INTEGER,
        average_time REAL,
        min_time INTEGER,
        max_time INTEGER,
        p95_time INTEGER,
        p99_time INTEGER,
        throughput REAL,
        memory_delta INTEGER,
        timestamp INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON performance_metrics(timestamp);
      CREATE INDEX IF NOT EXISTS idx_metrics_endpoint ON performance_metrics(endpoint);
      CREATE INDEX IF NOT EXISTS idx_benchmarks_operation ON benchmarks(operation);
    `);
  }

  logMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: Date.now(),
      memoryUsage: process.memoryUsage?.()?.heapUsed,
      cpuUsage: process.cpuUsage?.()?.user / process.cpuUsage?.()?.system || 0
    };

    this.metrics.push(fullMetric);

    // Batch insert for performance
    if (this.metrics.length >= 10) {
      this.flushMetrics();
    }
  }

  private flushMetrics(): void {
    if (this.metrics.length === 0) return;

    const stmt = this.db.prepare(`
      INSERT INTO performance_metrics
      (timestamp, endpoint, method, response_time, status_code, user_agent, connection_type, memory_usage, cpu_usage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const metric of this.metrics) {
      stmt.run(
        metric.timestamp,
        metric.endpoint,
        metric.method,
        metric.responseTime,
        metric.statusCode,
        metric.userAgent,
        metric.connectionType,
        metric.memoryUsage,
        metric.cpuUsage
      );
    }

    this.metrics = [];
  }

  async runBenchmark<T>(
    operation: string,
    iterations: number,
    testFn: () => T | Promise<T>
  ): Promise<BenchmarkResult> {
    const times: number[] = [];
    const memoryStart = process.memoryUsage?.()?.heapUsed || 0;

    console.log(`🧪 Running benchmark: ${operation} (${iterations} iterations)`);

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await testFn();
      const end = performance.now();
      times.push(end - start);

      // Progress indicator
      if ((i + 1) % Math.max(1, Math.floor(iterations / 10)) === 0) {
        console.log(`  Progress: ${((i + 1) / iterations * 100).toFixed(1)}%`);
      }
    }

    const memoryEnd = process.memoryUsage?.()?.heapUsed || 0;
    const totalTime = times.reduce((a, b) => a + b, 0);
    const averageTime = totalTime / iterations;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const p95Time = StatisticalAnalyzer.percentile(times, 95);
    const p99Time = StatisticalAnalyzer.percentile(times, 99);
    const throughput = iterations / (totalTime / 1000); // ops per second
    const memoryDelta = memoryEnd - memoryStart;

    const result: BenchmarkResult = {
      operation,
      iterations,
      totalTime,
      averageTime,
      minTime,
      maxTime,
      p95Time,
      p99Time,
      throughput,
      memoryDelta
    };

    // Store benchmark result
    const stmt = this.db.prepare(`
      INSERT INTO benchmarks
      (operation, iterations, total_time, average_time, min_time, max_time, p95_time, p99_time, throughput, memory_delta, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      operation,
      iterations,
      totalTime,
      averageTime,
      minTime,
      maxTime,
      p95Time,
      p99Time,
      throughput,
      memoryDelta,
      Date.now()
    );

    console.log(`✅ Benchmark completed: ${operation}`);
    console.log(`   Average: ${averageTime.toFixed(2)}ms`);
    console.log(`   P95: ${p95Time.toFixed(2)}ms`);
    console.log(`   Throughput: ${throughput.toFixed(0)} ops/sec`);
    console.log(`   Memory delta: ${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);

    return result;
  }

  async getMetricsAnalysis(hours: number = 24): Promise<{
    summary: {
      totalRequests: number;
      averageResponseTime: number;
      errorRate: number;
      p95ResponseTime: number;
    };
    endpoints: Array<{
      endpoint: string;
      method: string;
      count: number;
      averageTime: number;
      errorRate: number;
    }>;
    trends: {
      responseTime: ReturnType<typeof StatisticalAnalyzer.trendAnalysis>;
      errorRate: ReturnType<typeof StatisticalAnalyzer.trendAnalysis>;
    };
  }> {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);

    const metricsStmt = this.db.prepare(`
      SELECT endpoint, method, response_time, status_code
      FROM performance_metrics
      WHERE timestamp > ?
      ORDER BY timestamp ASC
    `);

    const metrics = metricsStmt.all(cutoff) as Array<{
      endpoint: string;
      method: string;
      response_time: number;
      status_code: number;
    }>;

    if (metrics.length === 0) {
      return {
        summary: { totalRequests: 0, averageResponseTime: 0, errorRate: 0, p95ResponseTime: 0 },
        endpoints: [],
        trends: {
          responseTime: { slope: 0, intercept: 0, rSquared: 0, trend: 'stable' },
          errorRate: { slope: 0, intercept: 0, rSquared: 0, trend: 'stable' }
        }
      };
    }

    // Calculate summary statistics
    const responseTimes = metrics.map(m => m.response_time);
    const errors = metrics.filter(m => m.status_code >= 400);
    const errorRate = errors.length / metrics.length;

    // Group by endpoint
    const endpointGroups = new Map<string, typeof metrics>();
    for (const metric of metrics) {
      const key = `${metric.endpoint}:${metric.method}`;
      if (!endpointGroups.has(key)) {
        endpointGroups.set(key, []);
      }
      endpointGroups.get(key)!.push(metric);
    }

    const endpoints = Array.from(endpointGroups.entries()).map(([key, groupMetrics]) => {
      const [endpoint, method] = key.split(':');
      const endpointErrors = groupMetrics.filter(m => m.status_code >= 400);
      return {
        endpoint,
        method,
        count: groupMetrics.length,
        averageTime: StatisticalAnalyzer.mean(groupMetrics.map(m => m.response_time)),
        errorRate: endpointErrors.length / groupMetrics.length
      };
    });

    // Calculate trends (last 10 data points)
    const timeWindows = Math.min(10, Math.floor(metrics.length / 10));
    const windowSize = Math.floor(metrics.length / timeWindows);

    const responseTimeTrend: number[] = [];
    const errorRateTrend: number[] = [];

    for (let i = 0; i < timeWindows; i++) {
      const start = i * windowSize;
      const end = Math.min((i + 1) * windowSize, metrics.length);
      const window = metrics.slice(start, end);

      const avgResponseTime = StatisticalAnalyzer.mean(window.map(m => m.response_time));
      const windowErrors = window.filter(m => m.status_code >= 400);
      const windowErrorRate = windowErrors.length / window.length;

      responseTimeTrend.push(avgResponseTime);
      errorRateTrend.push(windowErrorRate);
    }

    return {
      summary: {
        totalRequests: metrics.length,
        averageResponseTime: StatisticalAnalyzer.mean(responseTimes),
        errorRate,
        p95ResponseTime: StatisticalAnalyzer.percentile(responseTimes, 95)
      },
      endpoints: endpoints.sort((a, b) => b.count - a.count),
      trends: {
        responseTime: StatisticalAnalyzer.trendAnalysis(responseTimeTrend),
        errorRate: StatisticalAnalyzer.trendAnalysis(errorRateTrend)
      }
    };
  }

  async getSystemHealth(): Promise<SystemHealth> {
    // Database health
    const dbMetrics = await this.getMetricsAnalysis(1); // Last hour

    // Cache health (simplified)
    const cacheHealth = {
      hitRate: 0.85, // Would be calculated from actual cache metrics
      size: 1024 * 1024 * 50, // 50MB
      evictions: 0
    };

    // Memory health
    const memUsage = process.memoryUsage?.() || { heapUsed: 0, heapTotal: 0 };
    const memoryHealth = {
      used: memUsage.heapUsed,
      available: memUsage.heapTotal - memUsage.heapUsed,
      leakRate: 0 // Would be calculated from trend analysis
    };

    // CPU health
    const cpuUsage = process.cpuUsage?.() || { user: 0, system: 0 };
    const cpuHealth = {
      usage: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to seconds
      loadAverage: 0 // Would require OS-specific APIs
    };

    return {
      database: {
        connections: 1, // Simplified
        responseTime: dbMetrics.summary.averageResponseTime,
        errorRate: dbMetrics.summary.errorRate,
        throughput: dbMetrics.summary.totalRequests / 3600 // requests per second
      },
      cache: cacheHealth,
      memory: memoryHealth,
      cpu: cpuHealth
    };
  }

  async generateReport(): Promise<string> {
    const analysis = await this.getMetricsAnalysis(24);
    const health = await this.systemHealth();
    const benchmarks = await this.getRecentBenchmarks(5);

    let report = '# Performance Analysis Report - Suplementor\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;

    // System Health
    report += '## System Health\n\n';
    report += `### Database\n`;
    report += `- Response Time: ${health.database.responseTime.toFixed(2)}ms\n`;
    report += `- Error Rate: ${(health.database.errorRate * 100).toFixed(2)}%\n`;
    report += `- Throughput: ${health.database.throughput.toFixed(2)} req/sec\n\n`;

    report += `### Memory\n`;
    report += `- Used: ${(health.memory.used / 1024 / 1024).toFixed(2)}MB\n`;
    report += `- Available: ${(health.memory.available / 1024 / 1024).toFixed(2)}MB\n\n`;

    // Performance Summary
    report += '## Performance Summary (24h)\n\n';
    report += `- Total Requests: ${analysis.summary.totalRequests.toLocaleString()}\n`;
    report += `- Average Response Time: ${analysis.summary.averageResponseTime.toFixed(2)}ms\n`;
    report += `- P95 Response Time: ${analysis.summary.p95ResponseTime.toFixed(2)}ms\n`;
    report += `- Error Rate: ${(analysis.summary.errorRate * 100).toFixed(2)}%\n\n`;

    // Top Endpoints
    report += '## Top Endpoints\n\n';
    report += '| Endpoint | Method | Requests | Avg Time | Error Rate |\n';
    report += '|----------|--------|----------|----------|------------|\n';
    analysis.endpoints.slice(0, 10).forEach(endpoint => {
      report += `| ${endpoint.endpoint} | ${endpoint.method} | ${endpoint.count} | ${endpoint.averageTime.toFixed(2)}ms | ${(endpoint.errorRate * 100).toFixed(2)}% |\n`;
    });
    report += '\n';

    // Trends
    report += '## Performance Trends\n\n';
    report += `Response Time: ${analysis.trends.responseTime.trend} (R² = ${analysis.trends.responseTime.rSquared.toFixed(3)})\n`;
    report += `Error Rate: ${analysis.trends.errorRate.trend} (R² = ${analysis.trends.errorRate.rSquared.toFixed(3)})\n\n`;

    // Recent Benchmarks
    if (benchmarks.length > 0) {
      report += '## Recent Benchmarks\n\n';
      report += '| Operation | Iterations | Avg Time | P95 Time | Throughput |\n';
      report += '|-----------|------------|----------|----------|------------|\n';
      benchmarks.forEach(benchmark => {
        report += `| ${benchmark.operation} | ${benchmark.iterations} | ${benchmark.averageTime.toFixed(2)}ms | ${benchmark.p95Time.toFixed(2)}ms | ${benchmark.throughput.toFixed(0)} ops/sec |\n`;
      });
      report += '\n';
    }

    return report;
  }

  private async getRecentBenchmarks(limit: number = 5): Promise<BenchmarkResult[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM benchmarks
      ORDER BY timestamp DESC
      LIMIT ?
    `);

    const results = stmt.all(limit) as any[];
    return results.map(row => ({
      operation: row.operation,
      iterations: row.iterations,
      totalTime: row.total_time,
      averageTime: row.average_time,
      minTime: row.min_time,
      maxTime: row.max_time,
      p95Time: row.p95_time,
      p99Time: row.p99_time,
      throughput: row.throughput,
      memoryDelta: row.memory_delta
    }));
  }

  async cleanup(): Promise<void> {
    this.flushMetrics();

    // Remove old metrics (keep last 30 days)
    const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const stmt = this.db.prepare('DELETE FROM performance_metrics WHERE timestamp < ?');
    stmt.run(cutoff);

    // Vacuum database for performance
    this.db.exec('VACUUM');
  }

  close(): void {
    this.flushMetrics();
    this.db.close();
  }
}

// Global performance monitor instance
let globalMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(dbPath?: string): PerformanceMonitor {
  if (!globalMonitor) {
    globalMonitor = new PerformanceMonitor(dbPath);
  }
  return globalMonitor;
}

// Utility functions for performance testing
export async function benchmarkDatabaseOperations(): Promise<void> {
  const monitor = getPerformanceMonitor();

  console.log('🚀 Starting comprehensive performance benchmarking...\n');

  // SQLite operations benchmark
  await monitor.runBenchmark(
    'SQLite SELECT single record',
    1000,
    async () => {
      // Simulate database query
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2));
    }
  );

  await monitor.runBenchmark(
    'SQLite INSERT operation',
    500,
    async () => {
      // Simulate database insert
      await new Promise(resolve => setTimeout(resolve, Math.random() * 5));
    }
  );

  // API endpoint simulation
  await monitor.runBenchmark(
    'API Response - Supplements List',
    200,
    async () => {
      // Simulate API processing
      const data = Array.from({ length: 50 }, (_, i) => ({
        id: `supp-${i}`,
        name: `Supplement ${i}`,
        category: ['VITAMIN', 'MINERAL', 'AMINO_ACID'][i % 3]
      }));

      // Simulate JSON processing
      JSON.stringify(data);
      await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
    }
  );

  // 3D rendering simulation
  await monitor.runBenchmark(
    '3D Brain Rendering',
    50,
    async () => {
      // Simulate 3D calculations
      const vertices = Array.from({ length: 1000 }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: Math.random()
      }));

      // Simulate matrix transformations
      vertices.forEach(vertex => {
        const transformed = {
          x: vertex.x * Math.cos(0.1) - vertex.z * Math.sin(0.1),
          y: vertex.y,
          z: vertex.x * Math.sin(0.1) + vertex.z * Math.cos(0.1)
        };
        // Simulate rendering
        Math.sqrt(transformed.x ** 2 + transformed.y ** 2 + transformed.z ** 2);
      });

      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
    }
  );

  console.log('\n📊 Generating performance report...');
  const report = await monitor.generateReport();
  console.log(report);

  monitor.close();
}

// Real-time performance monitoring hook
export function usePerformanceMonitor() {
  const monitor = getPerformanceMonitor();

  return {
    logMetric: (metric: Omit<PerformanceMetric, 'timestamp'>) => {
      monitor.logMetric(metric);
    },

    runBenchmark: <T>(
      operation: string,
      iterations: number,
      testFn: () => T | Promise<T>
    ) => {
      return monitor.runBenchmark(operation, iterations, testFn);
    },

    getAnalysis: (hours?: number) => {
      return monitor.getMetricsAnalysis(hours);
    },

    getHealth: () => {
      return monitor.getSystemHealth();
    }
  };
}
