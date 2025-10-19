"use client";

export interface CacheEntry<T = any> {
	data: T;
	timestamp: number;
	expiresAt: number;
	size: number;
	source: "network" | "cache" | "offline";
	version?: string;
}

export interface CacheStats {
	totalEntries: number;
	totalSize: number;
	hitRate: number;
	lastCleanup: number;
	oldestEntry: number | null;
	newestEntry: number | null;
}

export interface OfflineQueueItem {
	id: string;
	action: "create" | "update" | "delete";
	data: any;
	endpoint: string;
	timestamp: number;
	retryCount: number;
}

export interface SyncStatus {
	isOnline: boolean;
	lastSync: number | null;
	pendingChanges: number;
	isBackgroundSync: boolean;
	syncError: string | null;
}

export type CacheStatus = "fresh" | "stale" | "expired" | "offline" | "syncing";

class CachingService {
	private static instance: CachingService;
	private cache = new Map<string, CacheEntry>();
	private offlineQueue: OfflineQueueItem[] = [];
	private syncStatus: SyncStatus = {
		isOnline: navigator.onLine,
		lastSync: null,
		pendingChanges: 0,
		isBackgroundSync: false,
		syncError: null,
	};
	private cacheHits = 0;
	private cacheMisses = 0;
	private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
	private readonly MAX_OFFLINE_QUEUE_SIZE = 1000;
	private readonly BACKGROUND_SYNC_INTERVAL = 30000; // 30 seconds

	private backgroundSyncTimer?: NodeJS.Timeout;
	private onlineHandler?: () => void;
	private offlineHandler?: () => void;

	static getInstance(): CachingService {
		if (!CachingService.instance) {
			CachingService.instance = new CachingService();
		}
		return CachingService.instance;
	}

	constructor() {
		this.initializeEventListeners();
		this.startBackgroundSync();
	}

	private initializeEventListeners(): void {
		if (typeof window === "undefined") return;

		this.onlineHandler = () => {
			this.syncStatus.isOnline = true;
			this.syncStatus.syncError = null;
			this.processOfflineQueue();
		};

		this.offlineHandler = () => {
			this.syncStatus.isOnline = false;
		};

		window.addEventListener("online", this.onlineHandler);
		window.addEventListener("offline", this.offlineHandler);
	}

	private startBackgroundSync(): void {
		if (typeof window === "undefined") return;

		this.backgroundSyncTimer = setInterval(() => {
			if (this.syncStatus.isOnline && this.offlineQueue.length > 0) {
				this.processOfflineQueue();
			}
		}, this.BACKGROUND_SYNC_INTERVAL);
	}

	// Cache management methods
	set<T>(
		key: string,
		data: T,
		options?: {
			ttl?: number;
			version?: string;
			source?: "network" | "cache" | "offline";
		},
	): void {
		const ttl = options?.ttl || 5 * 60 * 1000; // 5 minutes default
		const size = this.estimateSize(data);
		const entry: CacheEntry<T> = {
			data,
			timestamp: Date.now(),
			expiresAt: Date.now() + ttl,
			size,
			source: options?.source || "network",
			version: options?.version,
		};

		// Check if we need to cleanup before adding
		if (this.getTotalSize() + size > this.MAX_CACHE_SIZE) {
			this.cleanup();
		}

		this.cache.set(key, entry);

		// Store in localStorage for persistence if it's supplement data
		if (key.startsWith("supplements:")) {
			try {
				localStorage.setItem(`cache:${key}`, JSON.stringify(entry));
			} catch (error) {
				console.warn("Failed to persist cache entry to localStorage:", error);
			}
		}
	}

	get<T>(key: string): { data: T | null; status: CacheStatus; source: string } {
		// Try memory cache first
		const entry = this.cache.get(key);
		if (entry && entry.expiresAt > Date.now()) {
			this.cacheHits++;
			return {
				data: entry.data,
				status: "fresh",
				source: entry.source,
			};
		}

		// Try localStorage for persistence
		if (key.startsWith("supplements:")) {
			try {
				const stored = localStorage.getItem(`cache:${key}`);
				if (stored) {
					const parsedEntry: CacheEntry = JSON.parse(stored);
					if (parsedEntry.expiresAt > Date.now()) {
						this.cache.set(key, parsedEntry);
						this.cacheHits++;
						return {
							data: parsedEntry.data,
							status: "fresh",
							source: parsedEntry.source,
						};
					}
				}
			} catch (error) {
				console.warn(
					"Failed to retrieve cache entry from localStorage:",
					error,
				);
			}
		}

		// Cache miss or expired
		if (entry) {
			this.cache.delete(key);
			if (key.startsWith("supplements:")) {
				try {
					localStorage.removeItem(`cache:${key}`);
				} catch (error) {
					console.warn(
						"Failed to remove expired cache entry from localStorage:",
						error,
					);
				}
			}
		}

		this.cacheMisses++;
		return {
			data: null,
			status: this.syncStatus.isOnline ? "expired" : "offline",
			source: "network",
		};
	}

	delete(key: string): void {
		this.cache.delete(key);
		if (key.startsWith("supplements:")) {
			try {
				localStorage.removeItem(`cache:${key}`);
			} catch (error) {
				console.warn("Failed to remove cache entry from localStorage:", error);
			}
		}
	}

	clear(): void {
		this.cache.clear();
		this.cacheHits = 0;
		this.cacheMisses = 0;

		// Clear localStorage cache entries
		try {
			const keysToRemove: string[] = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key?.startsWith("cache:supplements:")) {
					keysToRemove.push(key);
				}
			}
			keysToRemove.forEach((key) => localStorage.removeItem(key));
		} catch (error) {
			console.warn("Failed to clear localStorage cache:", error);
		}
	}

	// Cache status and statistics
	getCacheStatus(key: string): CacheStatus {
		const entry = this.cache.get(key);
		if (!entry) return this.syncStatus.isOnline ? "expired" : "offline";

		if (entry.expiresAt <= Date.now()) return "expired";
		if (Date.now() - entry.timestamp > entry.expiresAt * 0.8) return "stale";

		return "fresh";
	}

	getCacheStats(): CacheStats {
		const entries = Array.from(this.cache.values());
		const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);

		return {
			totalEntries: this.cache.size,
			totalSize,
			hitRate:
				this.cacheHits + this.cacheMisses > 0
					? this.cacheHits / (this.cacheHits + this.cacheMisses)
					: 0,
			lastCleanup: Date.now(),
			oldestEntry:
				entries.length > 0
					? Math.min(...entries.map((e) => e.timestamp))
					: null,
			newestEntry:
				entries.length > 0
					? Math.max(...entries.map((e) => e.timestamp))
					: null,
		};
	}

	// Offline support methods
	addToOfflineQueue(
		item: Omit<OfflineQueueItem, "id" | "timestamp" | "retryCount">,
	): void {
		if (this.offlineQueue.length >= this.MAX_OFFLINE_QUEUE_SIZE) {
			this.offlineQueue.shift(); // Remove oldest item
		}

		const queueItem: OfflineQueueItem = {
			id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			timestamp: Date.now(),
			retryCount: 0,
			...item,
		};

		this.offlineQueue.push(queueItem);
		this.syncStatus.pendingChanges = this.offlineQueue.length;

		// Persist offline queue
		try {
			localStorage.setItem("offlineQueue", JSON.stringify(this.offlineQueue));
		} catch (error) {
			console.warn("Failed to persist offline queue:", error);
		}
	}

	private async processOfflineQueue(): Promise<void> {
		if (!this.syncStatus.isOnline || this.offlineQueue.length === 0) return;

		this.syncStatus.isBackgroundSync = true;
		this.syncStatus.syncError = null;

		const itemsToProcess = [...this.offlineQueue];
		const failedItems: OfflineQueueItem[] = [];

		for (const item of itemsToProcess) {
			try {
				await this.syncItem(item);
				// Remove from queue if successful
				this.offlineQueue = this.offlineQueue.filter((i) => i.id !== item.id);
			} catch (error) {
				item.retryCount++;
				console.warn(
					`Failed to sync item ${item.id}, retry ${item.retryCount}:`,
					error,
				);

				if (item.retryCount < 3) {
					failedItems.push(item);
				}
				// Remove items that have failed 3 times
			}
		}

		this.offlineQueue = failedItems;
		this.syncStatus.pendingChanges = this.offlineQueue.length;
		this.syncStatus.lastSync = Date.now();
		this.syncStatus.isBackgroundSync = false;

		// Update persisted queue
		try {
			localStorage.setItem("offlineQueue", JSON.stringify(this.offlineQueue));
		} catch (error) {
			console.warn("Failed to persist offline queue after sync:", error);
		}
	}

	private async syncItem(item: OfflineQueueItem): Promise<void> {
		const response = await fetch(item.endpoint, {
			method:
				item.action === "delete"
					? "DELETE"
					: item.action === "create"
						? "POST"
						: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: item.action !== "delete" ? JSON.stringify(item.data) : undefined,
		});

		if (!response.ok) {
			throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
		}
	}

	// Utility methods
	private estimateSize(data: any): number {
		return new Blob([JSON.stringify(data)]).size;
	}

	private getTotalSize(): number {
		return Array.from(this.cache.values()).reduce(
			(sum, entry) => sum + entry.size,
			0,
		);
	}

	private cleanup(): void {
		const entries = Array.from(this.cache.entries());
		const now = Date.now();

		// Remove expired entries first
		const expiredKeys = entries
			.filter(([, entry]) => entry.expiresAt <= now)
			.map(([key]) => key);

		expiredKeys.forEach((key) => {
			this.cache.delete(key);
			if (key.startsWith("supplements:")) {
				try {
					localStorage.removeItem(`cache:${key}`);
				} catch (error) {
					console.warn(
						"Failed to remove expired cache entry from localStorage:",
						error,
					);
				}
			}
		});

		// If still over limit, remove oldest entries
		const remainingEntries = Array.from(this.cache.entries()).sort(
			(a, b) => a[1].timestamp - b[1].timestamp,
		);

		while (
			remainingEntries.length > 0 &&
			this.getTotalSize() > this.MAX_CACHE_SIZE * 0.8
		) {
			const [key] = remainingEntries.shift()!;
			this.cache.delete(key);
			if (key.startsWith("supplements:")) {
				try {
					localStorage.removeItem(`cache:${key}`);
				} catch (error) {
					console.warn(
						"Failed to remove old cache entry from localStorage:",
						error,
					);
				}
			}
		}
	}

	// Public API methods
	getSyncStatus(): SyncStatus {
		return { ...this.syncStatus };
	}

	forceSync(): Promise<void> {
		return this.processOfflineQueue();
	}

	// Cleanup method for component unmount
	destroy(): void {
		if (this.backgroundSyncTimer) {
			clearInterval(this.backgroundSyncTimer);
		}

		if (typeof window !== "undefined") {
			if (this.onlineHandler) {
				window.removeEventListener("online", this.onlineHandler);
			}
			if (this.offlineHandler) {
				window.removeEventListener("offline", this.offlineHandler);
			}
		}
	}
}

// Named export for compatibility
export const cachingService = CachingService.getInstance();

export default CachingService;
