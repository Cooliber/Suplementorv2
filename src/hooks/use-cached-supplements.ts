"use client";

import { useState, useEffect, useCallback } from "react";
import { useSupplements, useSupplement, useSupplementSearch } from "@/lib/services/supplement-service";
import CachingService, { CacheStatus } from "@/lib/services/caching-service";

interface CachedSupplementOptions {
  ttl?: number;
  enableOffline?: boolean;
  enableBackgroundSync?: boolean;
  onSync?: (status: CacheStatus) => void;
}

interface CachedSupplementsResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  cacheStatus: CacheStatus;
  isOnline: boolean;
  pendingChanges: number;
  refetch: () => Promise<void>;
  refreshCache: () => Promise<void>;
  clearCache: () => void;
}

// Hook for cached supplement list
export function useCachedSupplements(
  query: any = {},
  options: CachedSupplementOptions = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes
    enableOffline = true,
    enableBackgroundSync = true,
    onSync,
  } = options;

  const [cacheStatus, setCacheStatus] = useState<CacheStatus>('fresh');
  const [isOnline, setIsOnline] = useState(true);
  const [pendingChanges, setPendingChanges] = useState(0);

  const cachingService = CachingService.getInstance();

  // Get data from supplement service
  const supplementResult = useSupplements(query);

  const checkCacheStatus = useCallback(() => {
    const syncStatus = cachingService.getSyncStatus();
    setIsOnline(syncStatus.isOnline);
    setPendingChanges(syncStatus.pendingChanges);

    if (query && Object.keys(query).length > 0) {
      const status = cachingService.getCacheStatus(`supplements:${JSON.stringify(query)}`);
      setCacheStatus(status);
      onSync?.(status);
    }
  }, [query, cachingService, onSync]);

  useEffect(() => {
    checkCacheStatus();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      checkCacheStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      checkCacheStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check status periodically
    const interval = setInterval(checkCacheStatus, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkCacheStatus]);

  const refetch = useCallback(async () => {
    try {
      await supplementResult.refetch();
      checkCacheStatus();
    } catch (error) {
      console.error('Failed to refetch supplements:', error);
      throw error;
    }
  }, [supplementResult.refetch, checkCacheStatus]);

  const refreshCache = useCallback(async () => {
    try {
      // Clear cache for this query
      const cacheKey = `supplements:${JSON.stringify(query)}`;
      cachingService.delete(cacheKey);

      // Refetch data
      await refetch();
    } catch (error) {
      console.error('Failed to refresh cache:', error);
      throw error;
    }
  }, [query, cachingService, refetch]);

  const clearCache = useCallback(() => {
    cachingService.clear();
    checkCacheStatus();
  }, [cachingService, checkCacheStatus]);

  return {
    data: supplementResult.data,
    error: supplementResult.error,
    isLoading: supplementResult.isLoading,
    cacheStatus,
    isOnline,
    pendingChanges,
    refetch,
    refreshCache,
    clearCache,
  } as CachedSupplementsResult<any[]>;
}

// Hook for cached single supplement
export function useCachedSupplement(
  id: string,
  options: CachedSupplementOptions = {}
) {
  const {
    ttl = 5 * 60 * 1000,
    enableOffline = true,
    enableBackgroundSync = true,
    onSync,
  } = options;

  const [cacheStatus, setCacheStatus] = useState<CacheStatus>('fresh');
  const [isOnline, setIsOnline] = useState(true);
  const [pendingChanges, setPendingChanges] = useState(0);

  const cachingService = CachingService.getInstance();

  const supplementResult = useSupplement(id);

  const checkCacheStatus = useCallback(() => {
    const syncStatus = cachingService.getSyncStatus();
    setIsOnline(syncStatus.isOnline);
    setPendingChanges(syncStatus.pendingChanges);

    if (id) {
      const status = cachingService.getCacheStatus(`supplement:${id}`);
      setCacheStatus(status);
      onSync?.(status);
    }
  }, [id, cachingService, onSync]);

  useEffect(() => {
    checkCacheStatus();

    const handleOnline = () => {
      setIsOnline(true);
      checkCacheStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      checkCacheStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(checkCacheStatus, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkCacheStatus]);

  const refetch = useCallback(async () => {
    try {
      await supplementResult.refetch();
      checkCacheStatus();
    } catch (error) {
      console.error('Failed to refetch supplement:', error);
      throw error;
    }
  }, [supplementResult.refetch, checkCacheStatus]);

  const refreshCache = useCallback(async () => {
    try {
      const cacheKey = `supplement:${id}`;
      cachingService.delete(cacheKey);
      await refetch();
    } catch (error) {
      console.error('Failed to refresh cache:', error);
      throw error;
    }
  }, [id, cachingService, refetch]);

  const clearCache = useCallback(() => {
    cachingService.clear();
    checkCacheStatus();
  }, [cachingService, checkCacheStatus]);

  return {
    data: supplementResult.data,
    error: supplementResult.error,
    isLoading: supplementResult.isLoading,
    cacheStatus,
    isOnline,
    pendingChanges,
    refetch,
    refreshCache,
    clearCache,
  } as CachedSupplementsResult<any>;
}

// Hook for cached supplement search
export function useCachedSupplementSearch(options: CachedSupplementOptions = {}) {
  const {
    ttl = 2 * 60 * 1000, // 2 minutes for search results
    enableOffline = true,
    enableBackgroundSync = true,
    onSync,
  } = options;

  const [cacheStatus, setCacheStatus] = useState<CacheStatus>('fresh');
  const [isOnline, setIsOnline] = useState(true);
  const [pendingChanges, setPendingChanges] = useState(0);

  const cachingService = CachingService.getInstance();

  const searchResult = useSupplementSearch();

  const checkCacheStatus = useCallback(() => {
    const syncStatus = cachingService.getSyncStatus();
    setIsOnline(syncStatus.isOnline);
    setPendingChanges(syncStatus.pendingChanges);

    if (searchResult.searchResults.length > 0) {
      const status = cachingService.getCacheStatus(`search:${searchResult.searchResults.length}`);
      setCacheStatus(status);
      onSync?.(status);
    }
  }, [cachingService, searchResult.searchResults.length, onSync]);

  useEffect(() => {
    checkCacheStatus();

    const handleOnline = () => {
      setIsOnline(true);
      checkCacheStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      checkCacheStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(checkCacheStatus, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkCacheStatus]);

  const search = useCallback(async (term: string) => {
    try {
      await searchResult.search(term);
      checkCacheStatus();
    } catch (error) {
      console.error('Failed to search supplements:', error);
      throw error;
    }
  }, [searchResult.search, checkCacheStatus]);

  const refreshCache = useCallback(async () => {
    try {
      if (searchResult.searchResults.length > 0) {
        const cacheKey = `search:${searchResult.searchResults.length}`;
        cachingService.delete(cacheKey);
        checkCacheStatus();
      }
    } catch (error) {
      console.error('Failed to refresh search cache:', error);
      throw error;
    }
  }, [cachingService, searchResult.searchResults.length, checkCacheStatus]);

  const clearCache = useCallback(() => {
    cachingService.clear();
    checkCacheStatus();
  }, [cachingService, checkCacheStatus]);

  return {
    data: searchResult.searchResults,
    error: searchResult.error,
    isLoading: searchResult.isSearching,
    cacheStatus,
    isOnline,
    pendingChanges,
    refetch: () => searchResult.search(searchResult.searchResults.length > 0 ? 'last' : ''),
    refreshCache,
    clearCache,
    search,
    clearResults: searchResult.clearResults,
  } as CachedSupplementsResult<any[]> & {
    search: (term: string) => Promise<void>;
    clearResults: () => void;
  };
}

// Enhanced supplement service that integrates with caching
export class CachedSupplementService {
  private static instance: CachedSupplementService;
  private cachingService = CachingService.getInstance();

  static getInstance(): CachedSupplementService {
    if (!CachedSupplementService.instance) {
      CachedSupplementService.instance = new CachedSupplementService();
    }
    return CachedSupplementService.instance;
  }

  async getSupplements(query: any = {}): Promise<any[]> {
    const cacheKey = `supplements:${JSON.stringify(query)}`;

    // Check cache first
    const cached = this.cachingService.get(cacheKey);
    if (cached.data && cached.status === 'fresh') {
      return cached.data;
    }

    try {
      // Import supplement service dynamically to avoid circular dependency
      const { default: SupplementService } = await import('@/lib/services/supplement-service');
      const service = SupplementService.getInstance();

      const data = await service.getSupplements(query);

      // Cache the result
      this.cachingService.set(cacheKey, data, {
        ttl: 5 * 60 * 1000,
        source: 'network',
      });

      return data;
    } catch (error) {
      // If offline and we have cached data, return it even if stale
      if (!this.cachingService.getSyncStatus().isOnline && cached.data) {
        this.cachingService.set(cacheKey, cached.data, {
          ttl: 60 * 60 * 1000, // 1 hour for offline data
          source: 'offline',
        });
        return cached.data as any[];
      }

      // Add to offline queue for retry
      this.cachingService.addToOfflineQueue({
        action: 'create',
        data: query,
        endpoint: '/api/supplements',
      });

      throw error;
    }
  }

  async getSupplementById(id: string): Promise<any> {
    const cacheKey = `supplement:${id}`;

    const cached = this.cachingService.get(cacheKey);
    if (cached.data && cached.status === 'fresh') {
      return cached.data;
    }

    try {
      const { default: SupplementService } = await import('@/lib/services/supplement-service');
      const service = SupplementService.getInstance();

      const data = await service.getSupplementById(id);

      this.cachingService.set(cacheKey, data, {
        ttl: 5 * 60 * 1000,
        source: 'network',
      });

      return data;
    } catch (error) {
      if (!this.cachingService.getSyncStatus().isOnline && cached.data) {
        this.cachingService.set(cacheKey, cached.data, {
          ttl: 60 * 60 * 1000,
          source: 'offline',
        });
        return cached.data as any[];
      }

      throw error;
    }
  }

  async searchSupplements(searchTerm: string): Promise<any[]> {
    const cacheKey = `search:${searchTerm.trim()}`;

    const cached = this.cachingService.get(cacheKey);
    if (cached.data && cached.status === 'fresh') {
      return cached.data;
    }

    try {
      const { default: SupplementService } = await import('@/lib/services/supplement-service');
      const service = SupplementService.getInstance();

      const data = await service.searchSupplements(searchTerm);

      this.cachingService.set(cacheKey, data, {
        ttl: 2 * 60 * 1000,
        source: 'network',
      });

      return data;
    } catch (error) {
      if (!this.cachingService.getSyncStatus().isOnline && cached.data) {
        this.cachingService.set(cacheKey, cached.data, {
          ttl: 30 * 60 * 1000,
          source: 'offline',
        });
        return cached.data as any[];
      }

      throw error;
    }
  }

  clearCache(): void {
    this.cachingService.clear();
  }

  getCacheStatus(key: string): CacheStatus {
    return this.cachingService.getCacheStatus(key);
  }

  getSyncStatus() {
    return this.cachingService.getSyncStatus();
  }
}