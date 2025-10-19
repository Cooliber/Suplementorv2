/**
 * Performance Optimization Utilities
 *
 * Provides caching, lazy loading, and performance enhancements for the Suplementor app
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// LRU Cache implementation for data caching
class LRUCache<T> {
  private cache = new Map<string, T>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global caches
export const supplementCache = new LRUCache<any>(200);
export const brainRegionCache = new LRUCache<any>(50);
export const interactionCache = new LRUCache<any>(100);

// Debounce hook for search and input optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for scroll and resize events
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRan = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
}

// Memoized heavy computations
export function useMemoizedComputation<T>(
  computeFn: () => T,
  deps: React.DependencyList,
  cacheKey?: string
): T {
  return useMemo(() => {
    if (cacheKey) {
      const cached = supplementCache.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }
      const result = computeFn();
      supplementCache.set(cacheKey, result);
      return result;
    }
    return computeFn();
  }, deps);
}

// Virtual scrolling hook for large lists
export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    offsetY,
    totalHeight: items.length * itemHeight,
    onScroll: useThrottle((event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop);
    }, 16), // ~60fps
  };
}

// 3D rendering optimizations
export function use3DPerformanceOptimizations() {
  const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    // Detect device capabilities
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      setPerformanceMode('low');
      return;
    }

    // Check for WebGL extensions and capabilities
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';

    // Lower quality for integrated graphics or older devices
    if (renderer.toLowerCase().includes('intel') ||
        renderer.toLowerCase().includes('hd graphics') ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      setPerformanceMode('medium');
    }
  }, []);

  return {
    performanceMode,
    qualitySettings: {
      pixelRatio: performanceMode === 'high' ? window.devicePixelRatio : 1,
      antialias: performanceMode !== 'low',
      shadows: performanceMode === 'high',
      postProcessing: performanceMode === 'high',
    },
  };
}

// Resource preloading hook
export function useResourcePreloader(urls: string[]) {
  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const preload = useCallback(async () => {
    if (urls.length === 0) return;

    setIsLoading(true);
    const promises = urls.map(async (url) => {
      try {
        if (url.endsWith('.js') || url.endsWith('.ts') || url.endsWith('.tsx')) {
          // Dynamic import for JS modules
          await import(/* webpackIgnore: true */ url);
        } else {
          // Fetch for other resources
          await fetch(url);
        }
        setLoadedResources(prev => new Set([...prev, url]));
      } catch (error) {
        console.warn(`Failed to preload resource: ${url}`, error);
      }
    });

    await Promise.allSettled(promises);
    setIsLoading(false);
  }, [urls]);

  useEffect(() => {
    preload();
  }, [preload]);

  return { loadedResources, isLoading, preload };
}

// Memory usage monitoring
export function useMemoryMonitor() {
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryUsage({
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
        });
      }
    };

    const interval = setInterval(updateMemoryUsage, 5000);
    updateMemoryUsage();

    return () => clearInterval(interval);
  }, []);

  return memoryUsage;
}

// Bundle size optimization - dynamic imports
export const loadHeavyComponents = {
  Brain3D: () => import('@/components/educational/Brain3D'),
  StackBuilder: () => import('@/components/stack-builder/StackBuilder'),
  AdvancedAnalytics: () => import('@/components/analytics/AdvancedAnalytics'),
};

// Service worker for caching
export function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);
}

// Image lazy loading with intersection observer
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const isVisible = useIntersectionObserver(imgRef);

  useEffect(() => {
    if (!isVisible) return;

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
    };
    img.src = src;
  }, [src, isVisible]);

  return { imageSrc, isLoading, error, imgRef };
}
