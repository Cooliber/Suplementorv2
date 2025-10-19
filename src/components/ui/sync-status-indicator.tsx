"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import CachingService, {
	type SyncStatus,
} from "@/lib/services/caching-service";
import { cn } from "@/lib/utils";
import {
	AlertTriangle,
	ArrowDown,
	ArrowUp,
	CheckCircle,
	Clock,
	Cloud,
	CloudOff,
	RefreshCw,
	Wifi,
	WifiOff,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface SyncStatusIndicatorProps {
	showProgress?: boolean;
	showDetails?: boolean;
	compact?: boolean;
	onSync?: () => void;
	className?: string;
}

export function SyncStatusIndicator({
	showProgress = false,
	showDetails = true,
	compact = false,
	onSync,
	className,
}: SyncStatusIndicatorProps) {
	const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const cachingService = CachingService.getInstance();

	const refreshStatus = () => {
		const status = cachingService.getSyncStatus();
		setSyncStatus(status);
	};

	useEffect(() => {
		refreshStatus();

		// Listen for online/offline events
		const handleOnline = () => refreshStatus();
		const handleOffline = () => refreshStatus();

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		// Update status every 10 seconds
		const interval = setInterval(refreshStatus, 10000);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
			clearInterval(interval);
		};
	}, []);

	const handleSync = async () => {
		if (!onSync || !syncStatus?.isOnline) return;

		setIsLoading(true);
		try {
			await onSync();
			refreshStatus();
		} catch (error) {
			console.error("Sync failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const formatLastSync = (timestamp: number | null) => {
		if (!timestamp) return "Nigdy";

		const now = Date.now();
		const diffMs = now - timestamp;
		const diffMinutes = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMinutes / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMinutes < 1) return "Przed chwilą";
		if (diffMinutes < 60) return `${diffMinutes} min temu`;
		if (diffHours < 24) return `${diffHours}h temu`;
		return `${diffDays}d temu`;
	};

	if (!syncStatus) {
		return (
			<div className={cn("flex items-center gap-2", className)}>
				<div className="animate-spin">
					<RefreshCw className="h-4 w-4" />
				</div>
				<span className="text-gray-500 text-sm">Ładowanie...</span>
			</div>
		);
	}

	if (compact) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className={cn("flex items-center gap-1", className)}>
							{syncStatus.isOnline ? (
								<Badge
									variant="outline"
									className="border-green-200 bg-green-50 text-green-700"
								>
									<Wifi className="mr-1 h-3 w-3" />
									Online
								</Badge>
							) : (
								<Badge
									variant="outline"
									className="border-red-200 bg-red-50 text-red-700"
								>
									<WifiOff className="mr-1 h-3 w-3" />
									Offline
								</Badge>
							)}

							{syncStatus.pendingChanges > 0 && (
								<Badge
									variant="outline"
									className="border-orange-200 bg-orange-50 text-orange-700"
								>
									<ArrowUp className="mr-1 h-3 w-3" />
									{syncStatus.pendingChanges}
								</Badge>
							)}
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<div className="space-y-1 text-sm">
							<div>Status: {syncStatus.isOnline ? "Online" : "Offline"}</div>
							{syncStatus.lastSync && (
								<div>
									Ostatnia synchronizacja: {formatLastSync(syncStatus.lastSync)}
								</div>
							)}
							{syncStatus.pendingChanges > 0 && (
								<div>Oczekujące zmiany: {syncStatus.pendingChanges}</div>
							)}
							{syncStatus.syncError && (
								<div className="text-red-600">Błąd: {syncStatus.syncError}</div>
							)}
						</div>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<div className={cn("space-y-3", className)}>
			{/* Main Status */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{syncStatus.isOnline ? (
						<div className="flex items-center gap-2 text-green-600">
							<div className="relative">
								<Wifi className="h-5 w-5" />
								{syncStatus.isBackgroundSync && (
									<RefreshCw className="-top-1 -right-1 absolute h-3 w-3 animate-spin" />
								)}
							</div>
							<span className="font-medium">Online</span>
						</div>
					) : (
						<div className="flex items-center gap-2 text-red-600">
							<WifiOff className="h-5 w-5" />
							<span className="font-medium">Offline</span>
						</div>
					)}
				</div>

				{onSync && syncStatus.isOnline && (
					<Button
						size="sm"
						variant="outline"
						onClick={handleSync}
						disabled={isLoading}
					>
						<RefreshCw
							className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
						/>
						Synchronizuj
					</Button>
				)}
			</div>

			{/* Progress Bar */}
			{showProgress && syncStatus.isBackgroundSync && (
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span>Synchronizacja w tle...</span>
						<span className="text-blue-600">Trwa</span>
					</div>
					<Progress value={undefined} className="h-2" />
				</div>
			)}

			{/* Details */}
			{showDetails && (
				<div className="space-y-2 text-gray-600 text-sm">
					{syncStatus.lastSync && (
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4" />
							<span>
								Ostatnia synchronizacja: {formatLastSync(syncStatus.lastSync)}
							</span>
						</div>
					)}

					{syncStatus.pendingChanges > 0 && (
						<div className="flex items-center gap-2 text-orange-600">
							<ArrowUp className="h-4 w-4" />
							<span>{syncStatus.pendingChanges} oczekujących zmian</span>
						</div>
					)}

					{syncStatus.syncError && (
						<div className="flex items-center gap-2 text-red-600">
							<AlertTriangle className="h-4 w-4" />
							<span>Błąd synchronizacji: {syncStatus.syncError}</span>
						</div>
					)}
				</div>
			)}

			{/* Offline Mode Indicator */}
			{!syncStatus.isOnline && (
				<div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
					<div className="flex items-start gap-2">
						<CloudOff className="mt-0.5 h-5 w-5 text-orange-600" />
						<div className="space-y-1">
							<div className="font-medium text-orange-800">Tryb offline</div>
							<div className="text-orange-700 text-sm">
								Pracujesz bez połączenia z internetem. Zmiany zostaną
								zsynchronizowane po przywróceniu połączenia.
							</div>
							{syncStatus.pendingChanges > 0 && (
								<div className="font-medium text-orange-800 text-sm">
									{syncStatus.pendingChanges} zmian oczekuje na synchronizację
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// Floating sync indicator for real-time updates
export function FloatingSyncIndicator({ className }: { className?: string }) {
	const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	const cachingService = CachingService.getInstance();

	useEffect(() => {
		const refreshStatus = () => {
			const status = cachingService.getSyncStatus();
			setSyncStatus(status);

			// Show indicator when offline or when there are pending changes
			setIsVisible(
				!status.isOnline ||
					status.pendingChanges > 0 ||
					status.isBackgroundSync,
			);
		};

		refreshStatus();

		const handleOnline = () => {
			refreshStatus();
			// Auto-hide after 3 seconds when back online
			setTimeout(() => setIsVisible(false), 3000);
		};

		const handleOffline = () => refreshStatus();

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		const interval = setInterval(refreshStatus, 5000);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
			clearInterval(interval);
		};
	}, []);

	if (!isVisible || !syncStatus) return null;

	return (
		<div
			className={cn(
				"fixed right-4 bottom-4 z-50 transition-all duration-300",
				isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
				className,
			)}
		>
			<div
				className={cn(
					"rounded-lg border p-3 shadow-lg",
					!syncStatus.isOnline
						? "border-orange-200 bg-orange-50"
						: "border-blue-200 bg-blue-50",
				)}
			>
				<div className="flex items-center gap-2">
					{!syncStatus.isOnline ? (
						<WifiOff className="h-4 w-4 text-orange-600" />
					) : syncStatus.isBackgroundSync ? (
						<RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
					) : (
						<Cloud className="h-4 w-4 text-blue-600" />
					)}

					<div className="text-sm">
						{!syncStatus.isOnline ? (
							<div>
								<div className="font-medium text-orange-800">Offline</div>
								{syncStatus.pendingChanges > 0 && (
									<div className="text-orange-600">
										{syncStatus.pendingChanges} oczekujących
									</div>
								)}
							</div>
						) : syncStatus.isBackgroundSync ? (
							<div className="font-medium text-blue-800">Synchronizacja...</div>
						) : (
							<div className="font-medium text-blue-800">Online</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
