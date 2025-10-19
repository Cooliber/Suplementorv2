/**
 * Database Error Classes for Bun 1.3
 *
 * Comprehensive error handling with type safety and Bun runtime optimizations
 */

export enum DatabaseErrorCode {
  // Connection errors
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
  CONNECTION_LOST = 'CONNECTION_LOST',

  // Query errors
  QUERY_FAILED = 'QUERY_FAILED',
  QUERY_TIMEOUT = 'QUERY_TIMEOUT',
  INVALID_QUERY = 'INVALID_QUERY',

  // Transaction errors
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  TRANSACTION_ROLLBACK = 'TRANSACTION_ROLLBACK',
  TRANSACTION_TIMEOUT = 'TRANSACTION_TIMEOUT',

  // SQLite specific errors
  SQLITE_CONSTRAINT = 'SQLITE_CONSTRAINT',
  SQLITE_CORRUPT = 'SQLITE_CORRUPT',
  SQLITE_BUSY = 'SQLITE_BUSY',
  SQLITE_LOCKED = 'SQLITE_LOCKED',

  // MongoDB specific errors
  MONGODB_DUPLICATE_KEY = 'MONGODB_DUPLICATE_KEY',
  MONGODB_VALIDATION_ERROR = 'MONGODB_VALIDATION_ERROR',
  MONGODB_WRITE_CONCERN = 'MONGODB_WRITE_CONCERN',

  // Data integrity errors
  DATA_INTEGRITY_VIOLATION = 'DATA_INTEGRITY_VIOLATION',
  FOREIGN_KEY_VIOLATION = 'FOREIGN_KEY_VIOLATION',
  UNIQUE_CONSTRAINT_VIOLATION = 'UNIQUE_CONSTRAINT_VIOLATION',

  // Performance errors
  PERFORMANCE_DEGRADATION = 'PERFORMANCE_DEGRADATION',
  RESOURCE_EXHAUSTION = 'RESOURCE_EXHAUSTION',
  DEADLOCK_DETECTED = 'DEADLOCK_DETECTED',
}

export class DatabaseError extends Error {
  public readonly code: DatabaseErrorCode;
  public readonly isRetryable: boolean;
  public readonly severity: 'low' | 'medium' | 'high' | 'critical';
  public readonly context: Record<string, any>;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: DatabaseErrorCode,
    options: {
      isRetryable?: boolean;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      context?: Record<string, any>;
      cause?: Error;
    } = {}
  ) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.isRetryable = options.isRetryable ?? this.getDefaultRetryability(code);
    this.severity = options.severity ?? this.getDefaultSeverity(code);
    this.context = options.context ?? {};
    this.timestamp = new Date();

    if (options.cause) {
      this.cause = options.cause;
    }
  }

  private getDefaultRetryability(code: DatabaseErrorCode): boolean {
    switch (code) {
      case DatabaseErrorCode.CONNECTION_TIMEOUT:
      case DatabaseErrorCode.CONNECTION_LOST:
      case DatabaseErrorCode.QUERY_TIMEOUT:
      case DatabaseErrorCode.TRANSACTION_TIMEOUT:
      case DatabaseErrorCode.SQLITE_BUSY:
      case DatabaseErrorCode.SQLITE_LOCKED:
      case DatabaseErrorCode.DEADLOCK_DETECTED:
        return true;

      case DatabaseErrorCode.CONNECTION_FAILED:
      case DatabaseErrorCode.QUERY_FAILED:
      case DatabaseErrorCode.INVALID_QUERY:
      case DatabaseErrorCode.TRANSACTION_FAILED:
      case DatabaseErrorCode.SQLITE_CONSTRAINT:
      case DatabaseErrorCode.SQLITE_CORRUPT:
      case DatabaseErrorCode.MONGODB_DUPLICATE_KEY:
      case DatabaseErrorCode.MONGODB_VALIDATION_ERROR:
      case DatabaseErrorCode.DATA_INTEGRITY_VIOLATION:
      case DatabaseErrorCode.FOREIGN_KEY_VIOLATION:
      case DatabaseErrorCode.UNIQUE_CONSTRAINT_VIOLATION:
        return false;

      default:
        return false;
    }
  }

  private getDefaultSeverity(code: DatabaseErrorCode): 'low' | 'medium' | 'high' | 'critical' {
    switch (code) {
      case DatabaseErrorCode.CONNECTION_FAILED:
      case DatabaseErrorCode.SQLITE_CORRUPT:
      case DatabaseErrorCode.RESOURCE_EXHAUSTION:
        return 'critical';

      case DatabaseErrorCode.CONNECTION_LOST:
      case DatabaseErrorCode.CONNECTION_TIMEOUT:
      case DatabaseErrorCode.MONGODB_WRITE_CONCERN:
      case DatabaseErrorCode.DATA_INTEGRITY_VIOLATION:
        return 'high';

      case DatabaseErrorCode.QUERY_FAILED:
      case DatabaseErrorCode.QUERY_TIMEOUT:
      case DatabaseErrorCode.TRANSACTION_FAILED:
      case DatabaseErrorCode.SQLITE_BUSY:
      case DatabaseErrorCode.SQLITE_LOCKED:
      case DatabaseErrorCode.DEADLOCK_DETECTED:
        return 'medium';

      case DatabaseErrorCode.INVALID_QUERY:
      case DatabaseErrorCode.PERFORMANCE_DEGRADATION:
        return 'low';

      default:
        return 'medium';
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      isRetryable: this.isRetryable,
      severity: this.severity,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
      cause: this.cause,
    };
  }
}

// Specific database error classes
export class ConnectionError extends DatabaseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, DatabaseErrorCode.CONNECTION_FAILED, {
      isRetryable: false,
      severity: 'critical',
      context,
    });
    this.name = 'ConnectionError';
  }
}

export class QueryError extends DatabaseError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, DatabaseErrorCode.QUERY_FAILED, {
      isRetryable: false,
      severity: 'medium',
      context,
    });
    this.name = 'QueryError';
  }
}

export class SQLiteError extends DatabaseError {
  constructor(message: string, sqliteCode: number, context?: Record<string, any>) {
    let code = DatabaseErrorCode.QUERY_FAILED;
    let isRetryable = false;

    // Map SQLite error codes to our error codes
    switch (sqliteCode) {
      case 5: // SQLITE_BUSY
        code = DatabaseErrorCode.SQLITE_BUSY;
        isRetryable = true;
        break;
      case 6: // SQLITE_LOCKED
        code = DatabaseErrorCode.SQLITE_LOCKED;
        isRetryable = true;
        break;
      case 11: // SQLITE_CORRUPT
        code = DatabaseErrorCode.SQLITE_CORRUPT;
        break;
      case 19: // SQLITE_CONSTRAINT
        code = DatabaseErrorCode.SQLITE_CONSTRAINT;
        break;
    }

    super(message, code, {
      isRetryable,
      severity: code === DatabaseErrorCode.SQLITE_CORRUPT ? 'critical' : 'medium',
      context: { ...context, sqliteCode },
    });
    this.name = 'SQLiteError';
  }
}

export class MongoDBError extends DatabaseError {
  constructor(message: string, mongoCode?: number, context?: Record<string, any>) {
    let code = DatabaseErrorCode.QUERY_FAILED;

    // Map MongoDB error codes
    switch (mongoCode) {
      case 11000:
        code = DatabaseErrorCode.MONGODB_DUPLICATE_KEY;
        break;
      case 121:
        code = DatabaseErrorCode.MONGODB_VALIDATION_ERROR;
        break;
    }

    super(message, code, {
      isRetryable: false,
      severity: 'medium',
      context: { ...context, mongoCode },
    });
    this.name = 'MongoDBError';
  }
}

// Error handling utilities with Bun 1.3 optimizations
export class DatabaseErrorHandler {
  private static retryAttempts = new Map<string, number>();
  private static readonly MAX_RETRY_ATTEMPTS = 3;
  private static readonly RETRY_DELAY_MS = 1000;

  static async handleError<T>(
    operation: () => Promise<T>,
    operationId: string,
    options: {
      maxRetries?: number;
      retryDelay?: number;
      onRetry?: (attempt: number, error: DatabaseError) => void;
      onFailure?: (error: DatabaseError) => void;
    } = {}
  ): Promise<T> {
    const {
      maxRetries = this.MAX_RETRY_ATTEMPTS,
      retryDelay = this.RETRY_DELAY_MS,
      onRetry,
      onFailure,
    } = options;

    let lastError: DatabaseError;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof DatabaseError ? error : new DatabaseError(
          error instanceof Error ? error.message : 'Unknown database error',
          DatabaseErrorCode.QUERY_FAILED,
          { originalError: error }
        );

        // Log error with Bun's optimized console
        console.error(`Database operation failed (attempt ${attempt}):`, {
          operationId,
          error: lastError.toJSON(),
        });

        // Check if we should retry
        if (attempt <= maxRetries && lastError.isRetryable) {
          onRetry?.(attempt, lastError);

          // Exponential backoff with jitter
          const delay = retryDelay * Math.pow(2, attempt - 1) + Math.random() * 100;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Final failure
        onFailure?.(lastError);
        break;
      }
    }

    throw lastError;
  }

  static createRetryWrapper<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    operationId: string,
    options?: Parameters<typeof DatabaseErrorHandler.handleError>[2]
  ): T {
    return ((...args: Parameters<T>) => {
      return this.handleError(
        () => fn(...args),
        operationId,
        options
      );
    }) as T;
  }

  static logError(error: DatabaseError, context?: Record<string, any>) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: error.toJSON(),
      context,
      environment: {
        node_env: process.env.NODE_ENV,
        bun_version: Bun.version,
        platform: process.platform,
      },
    };

    // In production, this would be sent to a logging service
    console.error('Database Error Log:', JSON.stringify(logEntry, null, 2));
  }

  static createErrorBoundary<T>(
    operation: () => T,
    fallbackValue: T,
    errorHandler?: (error: DatabaseError) => void
  ): T {
    try {
      return operation();
    } catch (error) {
      const dbError = error instanceof DatabaseError ? error : new DatabaseError(
        error instanceof Error ? error.message : 'Unexpected error',
        DatabaseErrorCode.QUERY_FAILED,
        { originalError: error }
      );

      errorHandler?.(dbError);
      this.logError(dbError);

      return fallbackValue;
    }
  }
}

// Bun 1.3 specific error recovery utilities
export class BunDatabaseRecovery {
  static async recoverSQLiteConnection(dbPath: string): Promise<void> {
    try {
      // Check database integrity
      const { Database } = await import('bun:sqlite');
      const db = new Database(dbPath, { readonly: true });

      const integrityCheck = db.prepare('PRAGMA integrity_check').get() as { integrity_check: string };

      if (integrityCheck.integrity_check !== 'ok') {
        console.warn('SQLite database integrity check failed, attempting recovery...');

        // Create backup
        const backupPath = `${dbPath}.backup.${Date.now()}`;
        await Bun.write(backupPath, Bun.file(dbPath));

        // Attempt to recover
        db.exec('VACUUM');
        db.exec('REINDEX');

        console.log('SQLite database recovery completed');
      }

      db.close();
    } catch (error) {
      throw new SQLiteError(
        'Failed to recover SQLite database',
        -1, // Generic error code
        { dbPath, recoveryAttempt: true }
      );
    }
  }

  static async optimizeSQLitePerformance(dbPath: string): Promise<void> {
    try {
      const { Database } = await import('bun:sqlite');
      const db = new Database(dbPath);

      // Bun 1.3 optimized performance settings
      db.exec(`
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;
        PRAGMA cache_size = -64000; -- 64MB cache
        PRAGMA temp_store = MEMORY;
        PRAGMA mmap_size = 268435456; -- 256MB memory map
        PRAGMA page_size = 4096;
      `);

      console.log('SQLite performance optimizations applied');
      db.close();
    } catch (error) {
      console.warn('Failed to optimize SQLite performance:', error);
    }
  }
}

// Export error factory functions for convenience
export const createConnectionError = (message: string, context?: Record<string, any>) =>
  new ConnectionError(message, context);

export const createQueryError = (message: string, context?: Record<string, any>) =>
  new QueryError(message, context);

export const createSQLiteError = (message: string, code: number, context?: Record<string, any>) =>
  new SQLiteError(message, code, context);

export const createMongoDBError = (message: string, code?: number, context?: Record<string, any>) =>
  new MongoDBError(message, code, context);
