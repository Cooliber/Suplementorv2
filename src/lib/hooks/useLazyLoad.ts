/**
 * Lazy Loading Hook for Medical Data
 * Optimized for large supplement datasets and medical content
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface LazyLoadOptions {
	threshold?: number;
	rootMargin?: string;
	chunkSize?: number;
	maxChunks?: number;
}

interface LazyLoadState<T> {
	data: T[];
	loading: boolean;
	error: string | null;
	hasMore: boolean;
	loadMore: () => void;
	reset: () => void;
}

export function useLazyLoad<T>(
	dataLoader: (offset: number, limit: number) => Promise<T[]>,
	options: LazyLoadOptions = {}
): LazyLoadState<T> {
	const {
		threshold = 100,
		rootMargin = '50px',
		chunkSize = 20,
		maxChunks = 50,
	} = options;

	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(true);
	const [currentOffset, setCurrentOffset] = useState(0);

	const loadingRef = useRef(false);
	const observerRef = useRef<IntersectionObserver | null>(null);

	const loadMoreData = useCallback(async () => {
		if (loadingRef.current || !hasMore) return;

		loadingRef.current = true;
		setLoading(true);
		setError(null);

		try {
			const newData = await dataLoader(currentOffset, chunkSize);

			if (newData.length === 0) {
				setHasMore(false);
			} else {
				setData(prevData => [...prevData, ...newData]);
				setCurrentOffset(prev => prev + chunkSize);

				// Check if we've reached the maximum chunks
				if (Math.floor((currentOffset + chunkSize) / chunkSize) >= maxChunks) {
					setHasMore(false);
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load data');
		} finally {
			setLoading(false);
			loadingRef.current = false;
		}
	}, [currentOffset, chunkSize, dataLoader, hasMore, maxChunks]);

	const reset = useCallback(() => {
		setData([]);
		setCurrentOffset(0);
		setHasMore(true);
		setError(null);
		setLoading(false);
		loadingRef.current = false;
	}, []);

	// Intersection Observer for scroll-based loading
	useEffect(() => {
		if (observerRef.current) observerRef.current.disconnect();

		observerRef.current = new IntersectionObserver(
			(entries) => {
				const target = entries[0];
				if (target.isIntersecting && hasMore && !loading) {
					loadMoreData();
				}
			},
			{
				threshold,
				rootMargin,
			}
		);

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [hasMore, loading, loadMoreData, threshold, rootMargin]);

	return {
		data,
		loading,
		error,
		hasMore,
		loadMore: loadMoreData,
		reset,
	};
}

/**
 * Specialized hook for supplement data lazy loading
 */
export function useSupplementLazyLoad(options: LazyLoadOptions = {}) {
	return useLazyLoad(async (offset: number, limit: number) => {
		// Simulate API call - replace with actual API
		const response = await fetch(`/api/supplements?offset=${offset}&limit=${limit}`);
		if (!response.ok) {
			throw new Error('Failed to fetch supplements');
		}
		return response.json();
	}, { ...options, chunkSize: 15 }); // Smaller chunks for supplement data
}

/**
 * Specialized hook for medical content lazy loading
 */
export function useMedicalContentLazyLoad(contentType: string, options: LazyLoadOptions = {}) {
	return useLazyLoad(async (offset: number, limit: number) => {
		// Simulate API call - replace with actual API
		const response = await fetch(`/api/medical-content/${contentType}?offset=${offset}&limit=${limit}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch ${contentType}`);
		}
		return response.json();
	}, { ...options, chunkSize: 10 }); // Smaller chunks for medical content
}

/**
 * Hook for lazy loading 3D models and assets
 */
export function useAssetLazyLoad() {
	const [loadedAssets, setLoadedAssets] = useState<Set<string>>(new Set());
	const [loadingAssets, setLoadingAssets] = useState<Set<string>>(new Set());

	const loadAsset = useCallback(async (assetPath: string): Promise<void> => {
		if (loadedAssets.has(assetPath) || loadingAssets.has(assetPath)) {
			return;
		}

		setLoadingAssets(prev => new Set(prev).add(assetPath));

		try {
			// Simulate asset loading
			await new Promise(resolve => setTimeout(resolve, 100));

			// In a real implementation, you would:
			// - Load 3D models with Three.js loaders
			// - Load textures and materials
			// - Preload medical images

			setLoadedAssets(prev => new Set(prev).add(assetPath));
		} catch (error) {
			console.error(`Failed to load asset ${assetPath}:`, error);
		} finally {
			setLoadingAssets(prev => {
				const newSet = new Set(prev);
				newSet.delete(assetPath);
				return newSet;
			});
		}
	}, [loadedAssets, loadingAssets]);

	const isAssetLoaded = useCallback((assetPath: string) => {
		return loadedAssets.has(assetPath);
	}, [loadedAssets]);

	const isAssetLoading = useCallback((assetPath: string) => {
		return loadingAssets.has(assetPath);
	}, [loadingAssets]);

	return {
		loadAsset,
		isAssetLoaded,
		isAssetLoading,
		loadedCount: loadedAssets.size,
		loadingCount: loadingAssets.size,
	};
}