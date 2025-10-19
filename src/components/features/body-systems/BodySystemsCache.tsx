"use client";

import type { BodySystem } from "@/data/body-systems";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface CacheEntry {
	data: BodySystem[];
	timestamp: number;
	expiresAt: number;
}

interface BodySystemsCacheContextType {
	systems: BodySystem[];
	isLoading: boolean;
	error: string | null;
	lastUpdated: number | null;
	refreshData: () => Promise<void>;
	clearCache: () => void;
}

const BodySystemsCacheContext = createContext<
	BodySystemsCacheContextType | undefined
>(undefined);

const CACHE_KEY = "suplementor_body_systems";
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export function BodySystemsCacheProvider({
	children,
}: { children: React.ReactNode }) {
	const [cache, setCache] = useState<CacheEntry | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load data from cache or fetch fresh data
	const loadData = useCallback(async (forceRefresh = false) => {
		try {
			setIsLoading(true);
			setError(null);

			// Check if we have valid cached data
			const cachedData = localStorage.getItem(CACHE_KEY);
			if (cachedData && !forceRefresh) {
				try {
					const parsed: CacheEntry = JSON.parse(cachedData);
					if (Date.now() < parsed.expiresAt && Array.isArray(parsed.data)) {
						setCache(parsed);
						setIsLoading(false);
						return;
					}
				} catch (parseError) {
					console.warn("Invalid cache data, fetching fresh data:", parseError);
					localStorage.removeItem(CACHE_KEY);
				}
			}

			// Fetch fresh data with timeout
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

			try {
				const response = await fetch("/api/body-systems", {
					signal: controller.signal,
					headers: {
						"Content-Type": "application/json",
						"Cache-Control": forceRefresh ? "no-cache" : "default",
					},
				});

				clearTimeout(timeoutId);

				if (!response.ok) {
					throw new Error(
						`Błąd HTTP ${response.status}: ${response.statusText}`,
					);
				}

				const systems: BodySystem[] = await response.json();

				// Validate response data
				if (!Array.isArray(systems)) {
					throw new Error("Nieprawidłowy format danych z serwera");
				}

				if (systems.length === 0) {
					throw new Error("Brak danych o układach ciała");
				}

				// Cache the data
				const cacheEntry: CacheEntry = {
					data: systems,
					timestamp: Date.now(),
					expiresAt: Date.now() + CACHE_DURATION,
				};

				localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
				setCache(cacheEntry);
			} catch (fetchError) {
				clearTimeout(timeoutId);
				if (fetchError instanceof Error && fetchError.name === "AbortError") {
					throw new Error("Przekroczono limit czasu ładowania danych");
				}
				throw fetchError;
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Wystąpił nieznany błąd podczas ładowania danych";
			setError(errorMessage);
			console.error("Error loading body systems:", err);

			// Try to use fallback data if available
			try {
				const fallbackData = localStorage.getItem(`${CACHE_KEY}_fallback`);
				if (fallbackData) {
					const parsed: CacheEntry = JSON.parse(fallbackData);
					setCache(parsed);
					console.log("Using fallback cache data");
				}
			} catch (fallbackError) {
				console.warn("Fallback cache also invalid:", fallbackError);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Refresh data from server
	const refreshData = useCallback(async () => {
		await loadData(true);
	}, [loadData]);

	// Clear cache
	const clearCache = useCallback(() => {
		localStorage.removeItem(CACHE_KEY);
		setCache(null);
	}, []);

	// Load data on mount
	useEffect(() => {
		loadData();
	}, [loadData]);

	const value: BodySystemsCacheContextType = {
		systems: cache?.data || [],
		isLoading,
		error,
		lastUpdated: cache?.timestamp || null,
		refreshData,
		clearCache,
	};

	return (
		<BodySystemsCacheContext.Provider value={value}>
			{children}
		</BodySystemsCacheContext.Provider>
	);
}

export function useBodySystemsCache() {
	const context = useContext(BodySystemsCacheContext);
	if (context === undefined) {
		throw new Error(
			"useBodySystemsCache must be used within a BodySystemsCacheProvider",
		);
	}
	return context;
}

// Hook for checking if data is stale
export function useBodySystemsStaleness() {
	const { lastUpdated } = useBodySystemsCache();
	const [isStale, setIsStale] = useState(false);

	useEffect(() => {
		if (!lastUpdated) {
			setIsStale(true);
			return;
		}

		const checkStaleness = () => {
			const now = Date.now();
			const timeSinceUpdate = now - lastUpdated;
			setIsStale(timeSinceUpdate > STALE_TIME);
		};

		checkStaleness();
		const interval = setInterval(checkStaleness, 1000 * 30); // Check every 30 seconds

		return () => clearInterval(interval);
	}, [lastUpdated]);

	return isStale;
}
