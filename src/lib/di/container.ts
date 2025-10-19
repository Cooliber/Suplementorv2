/**
 * Dependency Injection Container for Suplementor
 *
 * Modular architecture with TypeScript interfaces and Bun 1.3 optimizations
 */

import type { Database } from 'bun:sqlite';
import type mongoose from 'mongoose';

// Service interfaces
export interface IDatabaseService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }>;
  isConnected(): boolean;
}

export interface ISupplementService {
  getSupplement(id: string): Promise<any>;
  searchSupplements(query: string, filters?: any): Promise<any[]>;
  createSupplement(data: any): Promise<any>;
  updateSupplement(id: string, data: any): Promise<any>;
  deleteSupplement(id: string): Promise<void>;
}

export interface IBrainRegionService {
  getBrainRegion(id: string): Promise<any>;
  getAllBrainRegions(): Promise<any[]>;
  getBrainRegionsByCategory(category: string): Promise<any[]>;
  updateBrainRegion(id: string, data: any): Promise<any>;
}

export interface IStackAnalysisService {
  analyzeStack(supplements: any[]): Promise<{
    interactions: any[];
    synergyScore: number;
    riskScore: number;
    optimizationSuggestions: any[];
  }>;
  generateSmartSuggestions(currentStack: any[], allSupplements: any[]): Promise<any[]>;
}

export interface IPerformanceMonitorService {
  logMetric(endpoint: string, method: string, responseTime: number, statusCode: number): Promise<void>;
  getMetrics(hours?: number): Promise<any[]>;
  getAverageResponseTime(endpoint?: string): Promise<number>;
}

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  getStats(): Promise<{ hits: number; misses: number; sets: number; deletes: number }>;
}

export interface ILoggerService {
  info(message: string, meta?: any): void;
  error(message: string, error?: Error, meta?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

// Service implementations
class SQLiteDatabaseService implements IDatabaseService {
  private db: Database | null = null;

  constructor(private dbPath: string) {}

  async connect(): Promise<void> {
    if (this.db) return;

    const { Database } = await import('bun:sqlite');
    this.db = new Database(this.dbPath, { create: true });

    // Initialize tables
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS supplements (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        polish_name TEXT,
        category TEXT,
        data TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS brain_regions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        polish_name TEXT,
        functions TEXT,
        data TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS performance_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint TEXT,
        method TEXT,
        response_time INTEGER,
        status_code INTEGER,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_supplements_category ON supplements(category);
      CREATE INDEX IF NOT EXISTS idx_performance_endpoint ON performance_metrics(endpoint);
    `);
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
    try {
      if (!this.db) return { status: 'unhealthy', details: { error: 'Not connected' } };

      const result = this.db.query('SELECT COUNT(*) as count FROM supplements').get() as { count: number };

      return {
        status: 'healthy',
        details: {
          supplementsCount: result.count,
          dbPath: this.dbPath
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  isConnected(): boolean {
    return this.db !== null;
  }

  getDB(): Database {
    if (!this.db) throw new Error('Database not connected');
    return this.db;
  }
}

class MongoDBDatabaseService implements IDatabaseService {
  private connection: typeof mongoose | null = null;

  constructor(private uri: string) {}

  async connect(): Promise<void> {
    if (this.connection) return;

    const mongoose = (await import('mongoose')).default;
    this.connection = await mongoose.connect(this.uri);
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.disconnect();
      this.connection = null;
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
    try {
      if (!this.connection) return { status: 'unhealthy', details: { error: 'Not connected' } };

      const db = this.connection.connection.db;
      const collections = await db.listCollections().toArray();

      return {
        status: 'healthy',
        details: {
          collectionsCount: collections.length,
          dbName: db.databaseName
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  isConnected(): boolean {
    return this.connection?.connection.readyState === 1;
  }

  getConnection(): typeof mongoose {
    if (!this.connection) throw new Error('Database not connected');
    return this.connection;
  }
}

class SupplementService implements ISupplementService {
  constructor(
    private dbService: IDatabaseService,
    private cacheService: ICacheService,
    private logger: ILoggerService
  ) {}

  async getSupplement(id: string): Promise<any> {
    // Try cache first
    const cached = await this.cacheService.get(`supplement:${id}`);
    if (cached) {
      this.logger.debug(`Supplement ${id} retrieved from cache`);
      return cached;
    }

    // Query database
    if (this.dbService instanceof SQLiteDatabaseService) {
      const db = (this.dbService as any).getDB();
      const result = db.query('SELECT * FROM supplements WHERE id = ?').get(id) as any;

      if (result) {
        const supplement = { ...result, ...JSON.parse(result.data || '{}') };
        await this.cacheService.set(`supplement:${id}`, supplement, 3600); // 1 hour TTL
        return supplement;
      }
    }

    return null;
  }

  async searchSupplements(query: string, filters?: any): Promise<any[]> {
    const cacheKey = `search:${query}:${JSON.stringify(filters || {})}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    // Implement search logic based on database type
    let results: any[] = [];

    if (this.dbService instanceof SQLiteDatabaseService) {
      const db = (this.dbService as any).getDB();
      const stmt = db.prepare(`
        SELECT * FROM supplements
        WHERE name LIKE ? OR polish_name LIKE ?
        ${filters?.category ? 'AND category = ?' : ''}
        LIMIT 50
      `);

      const searchPattern = `%${query}%`;
      const params = filters?.category
        ? [searchPattern, searchPattern, filters.category]
        : [searchPattern, searchPattern];

      results = stmt.all(...params) as any[];
      results = results.map(row => ({ ...row, ...JSON.parse(row.data || '{}') }));
    }

    await this.cacheService.set(cacheKey, results, 1800); // 30 minutes TTL
    return results;
  }

  async createSupplement(data: any): Promise<any> {
    const supplement = {
      id: data.id,
      name: data.name,
      polishName: data.polishName,
      category: data.category,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (this.dbService instanceof SQLiteDatabaseService) {
      const db = (this.dbService as any).getDB();
      const stmt = db.prepare(`
        INSERT INTO supplements (id, name, polish_name, category, data, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        supplement.id,
        supplement.name,
        supplement.polishName,
        supplement.category,
        JSON.stringify(supplement),
        supplement.updatedAt.toISOString()
      );
    }

    // Invalidate relevant caches
    await this.cacheService.delete(`supplement:${supplement.id}`);
    await this.cacheService.clear(); // Clear search caches

    this.logger.info(`Supplement ${supplement.id} created`);
    return supplement;
  }

  async updateSupplement(id: string, data: any): Promise<any> {
    const updatedSupplement = {
      ...data,
      updatedAt: new Date()
    };

    if (this.dbService instanceof SQLiteDatabaseService) {
      const db = (this.dbService as any).getDB();
      const stmt = db.prepare(`
        UPDATE supplements
        SET name = ?, polish_name = ?, category = ?, data = ?, updated_at = ?
        WHERE id = ?
      `);

      stmt.run(
        updatedSupplement.name,
        updatedSupplement.polishName,
        updatedSupplement.category,
        JSON.stringify(updatedSupplement),
        updatedSupplement.updatedAt.toISOString(),
        id
      );
    }

    // Update cache
    await this.cacheService.set(`supplement:${id}`, updatedSupplement, 3600);
    await this.cacheService.clear(); // Clear search caches

    this.logger.info(`Supplement ${id} updated`);
    return updatedSupplement;
  }

  async deleteSupplement(id: string): Promise<void> {
    if (this.dbService instanceof SQLiteDatabaseService) {
      const db = (this.dbService as any).getDB();
      const stmt = db.prepare('DELETE FROM supplements WHERE id = ?');
      stmt.run(id);
    }

    // Clear caches
    await this.cacheService.delete(`supplement:${id}`);
    await this.cacheService.clear();

    this.logger.info(`Supplement ${id} deleted`);
  }
}

// Dependency Injection Container
export class DIContainer {
  private services = new Map<string, any>();
  private singletons = new Map<string, any>();

  // Register a service
  register<T>(key: string, factory: (container: DIContainer) => T, singleton = true): void {
    this.services.set(key, { factory, singleton });
  }

  // Resolve a service
  resolve<T>(key: string): T {
    const serviceDefinition = this.services.get(key);
    if (!serviceDefinition) {
      throw new Error(`Service ${key} not registered`);
    }

    if (serviceDefinition.singleton) {
      if (!this.singletons.has(key)) {
        this.singletons.set(key, serviceDefinition.factory(this));
      }
      return this.singletons.get(key);
    }

    return serviceDefinition.factory(this);
  }

  // Check if a service is registered
  has(key: string): boolean {
    return this.services.has(key);
  }

  // Clear all services (useful for testing)
  clear(): void {
    this.services.clear();
    this.singletons.clear();
  }
}

// Create and configure the main container
export const container = new DIContainer();

// Register services based on environment
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Database service
if (isProduction || process.env.FORCE_MONGODB) {
  container.register('database', () => new MongoDBDatabaseService(process.env.MONGODB_URI!));
} else {
  container.register('database', () => new SQLiteDatabaseService('./dev-database.db'));
}

// Cache service (simplified in-memory cache for demo)
class InMemoryCacheService implements ICacheService {
  private cache = new Map<string, { value: any; expires?: number }>();
  private stats = { hits: 0, misses: 0, sets: 0, deletes: 0 };

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) {
      this.stats.misses++;
      return null;
    }

    if (item.expires && Date.now() > item.expires) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.value;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const expires = ttl ? Date.now() + ttl * 1000 : undefined;
    this.cache.set(key, { value, expires });
    this.stats.sets++;
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    this.stats.deletes++;
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async getStats(): Promise<{ hits: number; misses: number; sets: number; deletes: number }> {
    return { ...this.stats };
  }
}

container.register('cache', () => new InMemoryCacheService());

// Logger service
class BunLoggerService implements ILoggerService {
  info(message: string, meta?: any): void {
    console.log(`[INFO] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  error(message: string, error?: Error, meta?: any): void {
    console.error(`[ERROR] ${message}`, error?.stack, meta ? JSON.stringify(meta) : '');
  }

  warn(message: string, meta?: any): void {
    console.warn(`[WARN] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, meta ? JSON.stringify(meta) : '');
    }
  }
}

container.register('logger', () => new BunLoggerService());

// Performance monitor service
class PerformanceMonitorService implements IPerformanceMonitorService {
  constructor(private dbService: IDatabaseService) {}

  async logMetric(endpoint: string, method: string, responseTime: number, statusCode: number): Promise<void> {
    if (this.dbService instanceof SQLiteDatabaseService) {
      const db = (this.dbService as any).getDB();
      const stmt = db.prepare(`
        INSERT INTO performance_metrics (endpoint, method, response_time, status_code)
        VALUES (?, ?, ?, ?)
      `);
      stmt.run(endpoint, method, responseTime, statusCode);
    }
  }

  async getMetrics(hours = 24): Promise<any[]> {
    if (this.dbService instanceof SQLiteDatabaseService) {
      const db = (this.dbService as any).getDB();
      const stmt = db.prepare(`
        SELECT endpoint, method, AVG(response_time) as avg_time, COUNT(*) as count
        FROM performance_metrics
        WHERE timestamp > datetime('now', '-${hours} hours')
        GROUP BY endpoint, method
        ORDER BY avg_time DESC
      `);
      return stmt.all() as any[];
    }
    return [];
  }

  async getAverageResponseTime(endpoint?: string): Promise<number> {
    const metrics = await this.getMetrics();
    if (endpoint) {
      const endpointMetrics = metrics.filter(m => m.endpoint === endpoint);
      if (endpointMetrics.length === 0) return 0;
      return endpointMetrics.reduce((sum, m) => sum + m.avg_time, 0) / endpointMetrics.length;
    }
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.avg_time, 0) / metrics.length;
  }
}

container.register('performanceMonitor', (c) => new PerformanceMonitorService(c.resolve('database')));

// Supplement service
container.register('supplementService', (c) => new SupplementService(
  c.resolve('database'),
  c.resolve('cache'),
  c.resolve('logger')
));

// Export convenience functions
export const getDatabase = () => container.resolve<IDatabaseService>('database');
export const getSupplementService = () => container.resolve<ISupplementService>('supplementService');
export const getCache = () => container.resolve<ICacheService>('cache');
export const getLogger = () => container.resolve<ILoggerService>('logger');
export const getPerformanceMonitor = () => container.resolve<IPerformanceMonitorService>('performanceMonitor');

// Service health check
export async function checkServiceHealth(): Promise<{
  database: boolean;
  cache: boolean;
  services: Record<string, boolean>;
}> {
  const results = {
    database: false,
    cache: false,
    services: {} as Record<string, boolean>
  };

  try {
    const dbHealth = await getDatabase().healthCheck();
    results.database = dbHealth.status === 'healthy';
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    const cacheStats = await getCache().getStats();
    results.cache = cacheStats !== null;
  } catch (error) {
    console.error('Cache health check failed:', error);
  }

  // Check other services
  const services = ['supplementService', 'performanceMonitor'];
  for (const service of services) {
    try {
      container.resolve(service);
      results.services[service] = true;
    } catch (error) {
      results.services[service] = false;
    }
  }

  return results;
}
