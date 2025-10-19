/**
 * Lazy Loading Hook for Large Neurobiology Data
 * Implements dynamic imports and caching for better performance
 */

import {
	getCachedData,
	loadBrainAnatomyData,
	loadDataWithSizeLimit,
	loadKnowledgeContent,
	loadMultipleDataTypes,
	loadNeurotransmitterData,
	loadSupplementData,
	preloadCriticalData,
	setCachedData,
} from "@/lib/data-loader";
import { useCallback, useEffect, useState } from "react";

export interface LazyDataState<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
	loaded: boolean;
}

export interface LazyDataOptions {
	preload?: boolean;
	cacheKey?: string;
	sizeLimit?: number;
	retryCount?: number;
}

// Hook for lazy loading brain anatomy data
export function useBrainAnatomyData(options: LazyDataOptions = {}) {
	const [state, setState] = useState<LazyDataState<any>>({
		data: null,
		loading: false,
		error: null,
		loaded: false,
	});

	const loadData = useCallback(async () => {
		const { cacheKey = "brain-anatomy", sizeLimit, retryCount = 3 } = options;

		// Check cache first
		const cachedData = getCachedData(cacheKey);
		if (cachedData) {
			setState({
				data: cachedData,
				loading: false,
				error: null,
				loaded: true,
			});
			return;
		}

		setState((prev) => ({ ...prev, loading: true, error: null }));

		let attempts = 0;
		while (attempts < retryCount) {
			try {
				const loader = () => loadBrainAnatomyData();
				const data = await loadDataWithSizeLimit(loader, sizeLimit);

				setCachedData(cacheKey, data);
				setState({
					data,
					loading: false,
					error: null,
					loaded: true,
				});
				return;
			} catch (error) {
				attempts++;
				if (attempts >= retryCount) {
					setState((prev) => ({
						...prev,
						loading: false,
						error:
							error instanceof Error
								? error.message
								: "Failed to load brain anatomy data",
					}));
				} else {
					// Wait before retry
					await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
				}
			}
		}
	}, [options.cacheKey, options.sizeLimit, options.retryCount]);

	useEffect(() => {
		if (options.preload) {
			loadData();
		}
	}, [loadData, options.preload]);

	return {
		...state,
		loadData,
		refetch: loadData,
	};
}

// Hook for lazy loading supplement data
export function useSupplementData(options: LazyDataOptions = {}) {
	const [state, setState] = useState<LazyDataState<any>>({
		data: null,
		loading: false,
		error: null,
		loaded: false,
	});

	const loadData = useCallback(async () => {
		const { cacheKey = "supplement-data", sizeLimit, retryCount = 3 } = options;

		const cachedData = getCachedData(cacheKey);
		if (cachedData) {
			setState({
				data: cachedData,
				loading: false,
				error: null,
				loaded: true,
			});
			return;
		}

		setState((prev) => ({ ...prev, loading: true, error: null }));

		let attempts = 0;
		while (attempts < retryCount) {
			try {
				const loader = () => loadSupplementData();
				const data = await loadDataWithSizeLimit(loader, sizeLimit);

				setCachedData(cacheKey, data);
				setState({
					data,
					loading: false,
					error: null,
					loaded: true,
				});
				return;
			} catch (error) {
				attempts++;
				if (attempts >= retryCount) {
					setState((prev) => ({
						...prev,
						loading: false,
						error:
							error instanceof Error
								? error.message
								: "Failed to load supplement data",
					}));
				} else {
					await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
				}
			}
		}
	}, [options.cacheKey, options.sizeLimit, options.retryCount]);

	useEffect(() => {
		if (options.preload) {
			loadData();
		}
	}, [loadData, options.preload]);

	return {
		...state,
		loadData,
		refetch: loadData,
	};
}

// Hook for lazy loading knowledge content
export function useKnowledgeContent(options: LazyDataOptions = {}) {
	const [state, setState] = useState<LazyDataState<any>>({
		data: null,
		loading: false,
		error: null,
		loaded: false,
	});

	const loadData = useCallback(async () => {
		const {
			cacheKey = "knowledge-content",
			sizeLimit,
			retryCount = 3,
		} = options;

		const cachedData = getCachedData(cacheKey);
		if (cachedData) {
			setState({
				data: cachedData,
				loading: false,
				error: null,
				loaded: true,
			});
			return;
		}

		setState((prev) => ({ ...prev, loading: true, error: null }));

		let attempts = 0;
		while (attempts < retryCount) {
			try {
				const loader = () => loadKnowledgeContent();
				const data = await loadDataWithSizeLimit(loader, sizeLimit);

				setCachedData(cacheKey, data);
				setState({
					data,
					loading: false,
					error: null,
					loaded: true,
				});
				return;
			} catch (error) {
				attempts++;
				if (attempts >= retryCount) {
					setState((prev) => ({
						...prev,
						loading: false,
						error:
							error instanceof Error
								? error.message
								: "Failed to load knowledge content",
					}));
				} else {
					await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
				}
			}
		}
	}, [options.cacheKey, options.sizeLimit, options.retryCount]);

	useEffect(() => {
		if (options.preload) {
			loadData();
		}
	}, [loadData, options.preload]);

	return {
		...state,
		loadData,
		refetch: loadData,
	};
}

// Hook for loading multiple data types
export function useMultipleDataTypes(
	dataTypes: string[],
	options: LazyDataOptions = {},
) {
	const [state, setState] = useState<LazyDataState<Record<string, any>>>({
		data: null,
		loading: false,
		error: null,
		loaded: false,
	});

	const loadData = useCallback(async () => {
		const { cacheKey = "multiple-data", sizeLimit, retryCount = 3 } = options;

		const cachedData = getCachedData(cacheKey);
		if (cachedData) {
			setState({
				data: cachedData,
				loading: false,
				error: null,
				loaded: true,
			});
			return;
		}

		setState((prev) => ({ ...prev, loading: true, error: null }));

		let attempts = 0;
		while (attempts < retryCount) {
			try {
				const data = await loadMultipleDataTypes(dataTypes);

				setCachedData(cacheKey, data);
				setState({
					data,
					loading: false,
					error: null,
					loaded: true,
				});
				return;
			} catch (error) {
				attempts++;
				if (attempts >= retryCount) {
					setState((prev) => ({
						...prev,
						loading: false,
						error:
							error instanceof Error
								? error.message
								: "Failed to load multiple data types",
					}));
				} else {
					await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
				}
			}
		}
	}, [dataTypes, options.cacheKey, options.sizeLimit, options.retryCount]);

	useEffect(() => {
		if (options.preload) {
			loadData();
		}
	}, [loadData, options.preload]);

	return {
		...state,
		loadData,
		refetch: loadData,
	};
}

// Hook for preloading critical data on app initialization
export function usePreloadCriticalData() {
	const [preloaded, setPreloaded] = useState(false);

	useEffect(() => {
		const preload = async () => {
			try {
				await preloadCriticalData();
				setPreloaded(true);
			} catch (error) {
				console.error("Failed to preload critical data:", error);
			}
		};

		preload();
	}, []);

	return preloaded;
}

// Utility hook for conditional data loading
export function useConditionalDataLoader(
	condition: boolean,
	loader: () => Promise<any>,
	deps: any[] = [],
) {
	const [state, setState] = useState<LazyDataState<any>>({
		data: null,
		loading: false,
		error: null,
		loaded: false,
	});

	useEffect(() => {
		if (!condition) return;

		const load = async () => {
			setState((prev) => ({ ...prev, loading: true, error: null }));

			try {
				const data = await loader();
				setState({
					data,
					loading: false,
					error: null,
					loaded: true,
				});
			} catch (error) {
				setState((prev) => ({
					...prev,
					loading: false,
					error: error instanceof Error ? error.message : "Loading failed",
				}));
			}
		};

		load();
	}, [condition, ...deps]);

	return state;
}
