"use client";
import React from "react";

import { useLoadingState } from "@/components/ui/loading-error";
import { useErrorHandler } from "@/hooks/use-error-handler";
import Supplement from "@/lib/db/models/Supplement";

export interface SupplementQuery {
	category?: string;
	evidenceLevel?: string;
	search?: string;
	limit?: number;
	offset?: number;
}

export interface SupplementServiceResult<T> {
	data: T | null;
	error: string | null;
	isLoading: boolean;
	refetch: () => Promise<void>;
}

class SupplementService {
	private static instance: SupplementService;
	private cache = new Map<string, { data: any; timestamp: number }>();
	private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

	static getInstance(): SupplementService {
		if (!SupplementService.instance) {
			SupplementService.instance = new SupplementService();
		}
		return SupplementService.instance;
	}

	private getCacheKey(query: SupplementQuery): string {
		return JSON.stringify(query);
	}

	private isCacheValid(timestamp: number): boolean {
		return Date.now() - timestamp < this.CACHE_DURATION;
	}

	private getCachedData(query: SupplementQuery): any | null {
		const key = this.getCacheKey(query);
		const cached = this.cache.get(key);

		if (cached && this.isCacheValid(cached.timestamp)) {
			return cached.data;
		}

		// Remove expired cache entry
		if (cached) {
			this.cache.delete(key);
		}

		return null;
	}

	private setCacheData(query: SupplementQuery, data: any): void {
		const key = this.getCacheKey(query);
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
		});
	}

	async getSupplements(query: SupplementQuery = {}): Promise<any[]> {
		try {
			// Check cache first
			const cachedData = this.getCachedData(query);
			if (cachedData) {
				return cachedData;
			}

			// Build MongoDB query
			const mongoQuery: any = {};

			if (query.category) {
				mongoQuery.category = query.category;
			}

			if (query.evidenceLevel) {
				mongoQuery.evidenceLevel = query.evidenceLevel;
			}

			if (query.search) {
				mongoQuery.$text = { $search: query.search };
			}

			// Execute query
			let dbQuery = Supplement.find(mongoQuery);

			if (query.limit) {
				dbQuery = dbQuery.limit(query.limit);
			}

			if (query.offset) {
				dbQuery = dbQuery.skip(query.offset);
			}

			const supplements = await dbQuery.exec();

			// Cache the result
			this.setCacheData(query, supplements);

			return supplements;
		} catch (error) {
			console.error("Error fetching supplements:", error);
			throw new Error(
				`Nie udało się pobrać suplementów: ${error instanceof Error ? error.message : "Nieznany błąd"}`,
			);
		}
	}

	async getSupplementById(id: string): Promise<any> {
		try {
			const supplement = await Supplement.findById(id).exec();

			if (!supplement) {
				throw new Error(`Nie znaleziono suplementu o ID: ${id}`);
			}

			return supplement;
		} catch (error) {
			console.error("Error fetching supplement by ID:", error);
			throw new Error(
				`Nie udało się pobrać suplementu: ${error instanceof Error ? error.message : "Nieznany błąd"}`,
			);
		}
	}

	async searchSupplements(searchTerm: string): Promise<any[]> {
		try {
			if (!searchTerm.trim()) {
				return [];
			}

			const supplements = await Supplement.find(
				{
					$text: { $search: searchTerm },
				},
				{ score: { $meta: "textScore" } },
			)
				.sort({ score: { $meta: "textScore" } })
				.limit(20)
				.exec();

			return supplements;
		} catch (error) {
			console.error("Error searching supplements:", error);
			throw new Error(
				`Nie udało się wyszukać suplementów: ${error instanceof Error ? error.message : "Nieznany błąd"}`,
			);
		}
	}

	clearCache(): void {
		this.cache.clear();
	}
}

// React hook for supplement data with error handling
export function useSupplements(
	query: SupplementQuery = {},
): SupplementServiceResult<any[]> {
	const errorHandler = useErrorHandler();
	const loadingState = useLoadingState();

	const fetchSupplements = async () => {
		loadingState.startLoading();

		try {
			const service = SupplementService.getInstance();
			const data = await service.getSupplements(query);
			loadingState.stopLoading();
			return data;
		} catch (error) {
			const errorInfo = errorHandler.handleSupplementError(
				query.search || "suplementów",
				error instanceof Error ? error.message : "Nieznany błąd",
			);
			loadingState.setLoadingError(
				error instanceof Error
					? error.message
					: "Nie udało się załadować suplementów",
			);
			throw error;
		}
	};

	const refetch = async () => {
		errorHandler.clearErrors();
		await fetchSupplements();
	};

	// Fetch data on mount or when query changes
	React.useEffect(() => {
		fetchSupplements();
	}, [JSON.stringify(query)]);

	return {
		data: loadingState.error ? null : null, // TODO: wire actual data when integrated with state
		error:
			typeof loadingState.error === "string"
				? loadingState.error
				: loadingState.error instanceof Error
					? loadingState.error.message
					: null,
		isLoading: loadingState.isLoading,
		refetch,
	};
}

// Hook for single supplement
export function useSupplement(id: string): SupplementServiceResult<any> {
	const errorHandler = useErrorHandler();
	const loadingState = useLoadingState();

	const fetchSupplement = async () => {
		if (!id) return;

		loadingState.startLoading();

		try {
			const service = SupplementService.getInstance();
			const data = await service.getSupplementById(id);
			loadingState.stopLoading();
			return data;
		} catch (error) {
			const errorInfo = errorHandler.handleSupplementError(
				undefined,
				error instanceof Error ? error.message : "Nieznany błąd",
			);
			loadingState.setLoadingError(
				error instanceof Error
					? error.message
					: "Nie udało się załadować suplementu",
			);
			throw error;
		}
	};

	const refetch = async () => {
		errorHandler.clearErrors();
		await fetchSupplement();
	};

	React.useEffect(() => {
		fetchSupplement();
	}, [id]);

	return {
		data: loadingState.error ? null : null,
		error:
			typeof loadingState.error === "string"
				? loadingState.error
				: loadingState.error instanceof Error
					? loadingState.error.message
					: null,
		isLoading: loadingState.isLoading,
		refetch,
	};
}

// Hook for supplement search
export function useSupplementSearch(): {
	searchResults: any[];
	isSearching: boolean;
	error: string | null;
	search: (term: string) => Promise<void>;
	clearResults: () => void;
} {
	const errorHandler = useErrorHandler();
	const [searchResults, setSearchResults] = React.useState<any[]>([]);
	const [isSearching, setIsSearching] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const search = async (term: string) => {
		if (!term.trim()) {
			setSearchResults([]);
			return;
		}

		setIsSearching(true);
		setError(null);

		try {
			const service = SupplementService.getInstance();
			const results = await service.searchSupplements(term);
			setSearchResults(results);
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Nie udało się wyszukać suplementów";
			setError(errorMessage);
			errorHandler.handleSupplementError(term, errorMessage);
		} finally {
			setIsSearching(false);
		}
	};

	const clearResults = () => {
		setSearchResults([]);
		setError(null);
	};

	return {
		searchResults,
		isSearching,
		error,
		search,
		clearResults,
	};
}

export default SupplementService;
