/**
 * Dynamic Data Loader for Large Neurobiology Content
 * Implements lazy loading for better deployment performance
 */

import {
	type BrainRegion,
	NeurotransmitterProfile,
	ResearchReference,
	SupplementEffect,
} from "@/data/comprehensive-brain-anatomy";

// Dynamic import function for brain anatomy data
export const loadBrainAnatomyData = async (): Promise<{
	comprehensiveBrainRegions: BrainRegion[];
}> => {
	try {
		const module = await import("@/data/comprehensive-brain-anatomy");
		return {
			comprehensiveBrainRegions: module.comprehensiveBrainRegions,
		};
	} catch (error) {
		console.error("Failed to load brain anatomy data:", error);
		throw new Error("Brain anatomy data loading failed");
	}
};

// Dynamic import function for supplement data
export const loadSupplementData = async () => {
	try {
		const module = await import("@/data/comprehensive-supplements");
		return module;
	} catch (error) {
		console.error("Failed to load supplement data:", error);
		throw new Error("Supplement data loading failed");
	}
};

// Dynamic import function for knowledge content
export const loadKnowledgeContent = async () => {
	try {
		const module = await import("@/data/enhanced-knowledge-content");
		return module;
	} catch (error) {
		console.error("Failed to load knowledge content:", error);
		throw new Error("Knowledge content loading failed");
	}
};

// Dynamic import function for neurotransmitter data
export const loadNeurotransmitterData = async () => {
	try {
		const module = await import("@/data/neurotransmitter-systems");
		return module;
	} catch (error) {
		console.error("Failed to load neurotransmitter data:", error);
		throw new Error("Neurotransmitter data loading failed");
	}
};

// Batch loading function for multiple data types
export const loadMultipleDataTypes = async (dataTypes: string[]) => {
	const loaders = {
		brainAnatomy: loadBrainAnatomyData,
		supplements: loadSupplementData,
		knowledge: loadKnowledgeContent,
		neurotransmitters: loadNeurotransmitterData,
	};

	const results: Record<string, any> = {};
	const promises = dataTypes.map(async (type) => {
		const loader = loaders[type as keyof typeof loaders];
		if (loader) {
			try {
				results[type] = await loader();
			} catch (error) {
				console.error(`Failed to load ${type} data:`, error);
				results[type] = null;
			}
		}
	});

	await Promise.all(promises);
	return results;
};

// Preload critical data for faster initial page loads
export const preloadCriticalData = async () => {
	try {
		// Load only essential data for initial page render
		const [brainData] = await Promise.all([loadBrainAnatomyData()]);
		return brainData;
	} catch (error) {
		console.error("Failed to preload critical data:", error);
		return null;
	}
};

// Cache management for loaded data
const dataCache = new Map<string, any>();

export const getCachedData = (key: string) => {
	return dataCache.get(key);
};

export const setCachedData = (key: string, data: any) => {
	dataCache.set(key, data);
};

export const clearDataCache = () => {
	dataCache.clear();
};

// Memory-efficient data loading with size limits
export const loadDataWithSizeLimit = async (
	loader: () => Promise<any>,
	maxSize: number = 5 * 1024 * 1024, // 5MB default limit
): Promise<any> => {
	const startTime = performance.now();

	try {
		const data = await loader();

		// Basic size estimation (rough calculation)
		const estimatedSize = JSON.stringify(data).length;
		if (estimatedSize > maxSize) {
			console.warn(
				`Data size (${estimatedSize} bytes) exceeds limit (${maxSize} bytes)`,
			);
		}

		const loadTime = performance.now() - startTime;
		console.log(`Data loaded in ${loadTime.toFixed(2)}ms`);

		return data;
	} catch (error) {
		const loadTime = performance.now() - startTime;
		console.error(`Data loading failed after ${loadTime.toFixed(2)}ms:`, error);
		throw error;
	}
};
