"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import CachingService, {
	type CacheStats,
	type SyncStatus,
} from "@/lib/services/caching-service";
import { cn } from "@/lib/utils";
import {
	AlertTriangle,
	CheckCircle,
	Clock,
	Database,
	HardDrive,
	Info,
	RefreshCw,
	Trash2,
	Wifi,
	WifiOff,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface CacheManagementProps {
	className?: string;
	compact?: boolean;
}

export function CacheManagement({
	className,
	compact = false,
}: CacheManagementProps) {
	const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
	const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

	const cachingService = CachingService.getInstance();

	const refreshStats = async () => {
		setIsLoading(true);
		try {
			const stats = cachingService.getCacheStats();
			const sync = cachingService.getSyncStatus();
			setCacheStats(stats);
			setSyncStatus(sync);
		} catch (error) {
			console.error("Failed to refresh cache stats:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		refreshStats();

		// Refresh stats every 30 seconds
		const interval = setInterval(refreshStats, 30000);
		return () => clearInterval(interval);
	}, []);

	const handleClearCache = async () => {
		try {
			cachingService.clear();
			await refreshStats();
		} catch (error) {
			console.error("Failed to clear cache:", error);
		}
	};

	const handleForceSync = async () => {
		setIsLoading(true);
		try {
			await cachingService.forceSync();
			await refreshStats();
		} catch (error) {
			console.error("Failed to force sync:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const formatBytes = (bytes: number) => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
	};

	const formatLastUpdated = (timestamp: number | null) => {
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

	const getHitRateColor = (rate: number) => {
		if (rate >= 0.8) return "text-green-600";
		if (rate >= 0.6) return "text-yellow-600";
		return "text-red-600";
	};

	if (compact) {
		return (
			<Card className={cn("w-full", className)}>
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Database className="h-4 w-4" />
							<span className="font-medium text-sm">Cache</span>
							{cacheStats && (
								<Badge variant="outline" className="text-xs">
									{cacheStats.totalEntries} entries
								</Badge>
							)}
						</div>

						<div className="flex items-center gap-1">
							{syncStatus?.isOnline ? (
								<Wifi className="h-3 w-3 text-green-600" />
							) : (
								<WifiOff className="h-3 w-3 text-red-600" />
							)}

							<Dialog open={isOpen} onOpenChange={setIsOpen}>
								<DialogTrigger asChild>
									<Button size="sm" variant="ghost">
										<Info className="h-3 w-3" />
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-md">
									<DialogHeader>
										<DialogTitle>Zarządzanie pamięcią podręczną</DialogTitle>
										<DialogDescription>
											Szczegółowe informacje o stanie pamięci podręcznej i
											synchronizacji
										</DialogDescription>
									</DialogHeader>

									{cacheStats && syncStatus && (
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<div className="flex items-center gap-2">
														<HardDrive className="h-4 w-4" />
														<span className="font-medium text-sm">Rozmiar</span>
													</div>
													<div className="font-bold text-2xl">
														{formatBytes(cacheStats.totalSize)}
													</div>
													<Progress
														value={
															(cacheStats.totalSize / (50 * 1024 * 1024)) * 100
														}
														className="h-2"
													/>
												</div>

												<div className="space-y-2">
													<div className="flex items-center gap-2">
														<CheckCircle className="h-4 w-4" />
														<span className="font-medium text-sm">
															Trafienia
														</span>
													</div>
													<div
														className={cn(
															"font-bold text-2xl",
															getHitRateColor(cacheStats.hitRate),
														)}
													>
														{Math.round(cacheStats.hitRate * 100)}%
													</div>
													<div className="text-gray-500 text-xs">
														{cacheStats.totalEntries} wpisów
													</div>
												</div>
											</div>

											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="text-sm">Status synchronizacji</span>
													{syncStatus.isOnline ? (
														<Badge className="bg-green-100 text-green-800">
															Online
														</Badge>
													) : (
														<Badge variant="destructive">Offline</Badge>
													)}
												</div>

												{syncStatus.lastSync && (
													<div className="text-gray-500 text-xs">
														Ostatnia synchronizacja:{" "}
														{formatLastUpdated(syncStatus.lastSync)}
													</div>
												)}

												{syncStatus.pendingChanges > 0 && (
													<Alert>
														<AlertTriangle className="h-4 w-4" />
														<AlertDescription>
															{syncStatus.pendingChanges} oczekujących zmian do
															synchronizacji
														</AlertDescription>
													</Alert>
												)}
											</div>

											<div className="flex gap-2">
												<Button
													onClick={handleForceSync}
													disabled={isLoading || !syncStatus.isOnline}
													size="sm"
													className="flex-1"
												>
													<RefreshCw
														className={cn(
															"mr-2 h-4 w-4",
															isLoading && "animate-spin",
														)}
													/>
													Synchronizuj
												</Button>

												<Dialog
													open={isClearDialogOpen}
													onOpenChange={setIsClearDialogOpen}
												>
													<DialogTrigger asChild>
														<Button variant="outline" size="sm">
															<Trash2 className="mr-2 h-4 w-4" />
															Wyczyść
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>
																Wyczyść pamięć podręczną?
															</DialogTitle>
															<DialogDescription>
																Ta akcja usunie wszystkie dane z pamięci
																podręcznej. Dane zostaną ponownie pobrane przy
																następnym użyciu.
															</DialogDescription>
														</DialogHeader>
														<DialogFooter>
															<Button
																variant="outline"
																onClick={() => setIsClearDialogOpen(false)}
															>
																Anuluj
															</Button>
															<Button
																onClick={() => {
																	handleClearCache();
																	setIsClearDialogOpen(false);
																}}
															>
																Wyczyść
															</Button>
														</DialogFooter>
													</DialogContent>
												</Dialog>
											</div>
										</div>
									)}
								</DialogContent>
							</Dialog>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Database className="h-5 w-5" />
							Zarządzanie pamięcią podręczną
						</CardTitle>
						<CardDescription>
							Monitoruj i zarządzaj pamięcią podręczną aplikacji
						</CardDescription>
					</div>
					<Button
						onClick={refreshStats}
						disabled={isLoading}
						size="sm"
						variant="outline"
					>
						<RefreshCw
							className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
						/>
						Odśwież
					</Button>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				{cacheStats && (
					<>
						{/* Cache Statistics */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<HardDrive className="h-4 w-4 text-blue-600" />
									<span className="font-medium text-sm">Rozmiar pamięci</span>
								</div>
								<div className="font-bold text-2xl">
									{formatBytes(cacheStats.totalSize)}
								</div>
								<Progress
									value={(cacheStats.totalSize / (50 * 1024 * 1024)) * 100}
									className="h-2"
								/>
								<div className="text-gray-500 text-xs">
									Limit: {formatBytes(50 * 1024 * 1024)}
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<CheckCircle className="h-4 w-4 text-green-600" />
									<span className="font-medium text-sm">Efektywność</span>
								</div>
								<div
									className={cn(
										"font-bold text-2xl",
										getHitRateColor(cacheStats.hitRate),
									)}
								>
									{Math.round(cacheStats.hitRate * 100)}%
								</div>
								<div className="text-gray-500 text-xs">
									Współczynnik trafień
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-gray-600" />
									<span className="font-medium text-sm">Wpisy</span>
								</div>
								<div className="font-bold text-2xl">
									{cacheStats.totalEntries}
								</div>
								<div className="text-gray-500 text-xs">Aktywne wpisy</div>
							</div>
						</div>

						{/* Sync Status */}
						{syncStatus && (
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="font-medium text-sm">
										Status synchronizacji
									</span>
									<div className="flex items-center gap-2">
										{syncStatus.isOnline ? (
											<Badge className="bg-green-100 text-green-800">
												<Wifi className="mr-1 h-3 w-3" />
												Online
											</Badge>
										) : (
											<Badge variant="destructive">
												<WifiOff className="mr-1 h-3 w-3" />
												Offline
											</Badge>
										)}
									</div>
								</div>

								{syncStatus.lastSync && (
									<div className="text-gray-600 text-sm">
										Ostatnia synchronizacja:{" "}
										{formatLastUpdated(syncStatus.lastSync)}
									</div>
								)}

								{syncStatus.pendingChanges > 0 && (
									<Alert>
										<AlertTriangle className="h-4 w-4" />
										<AlertDescription>
											{syncStatus.pendingChanges} oczekujących zmian zostanie
											zsynchronizowanych po przywróceniu połączenia
										</AlertDescription>
									</Alert>
								)}

								{syncStatus.syncError && (
									<Alert variant="destructive">
										<AlertTriangle className="h-4 w-4" />
										<AlertDescription>
											Błąd synchronizacji: {syncStatus.syncError}
										</AlertDescription>
									</Alert>
								)}
							</div>
						)}

						{/* Actions */}
						<div className="flex gap-2 border-t pt-4">
							<Button
								onClick={handleForceSync}
								disabled={isLoading || !syncStatus?.isOnline}
								className="flex-1"
							>
								<RefreshCw
									className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
								/>
								Wymus synchronizację
							</Button>

							<Dialog
								open={isClearDialogOpen}
								onOpenChange={setIsClearDialogOpen}
							>
								<DialogTrigger asChild>
									<Button variant="outline">
										<Trash2 className="mr-2 h-4 w-4" />
										Wyczyść pamięć
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Wyczyść pamięć podręczną?</DialogTitle>
										<DialogDescription>
											Ta akcja usunie wszystkie dane z pamięci podręcznej. Dane
											zostaną ponownie pobrane przy następnym użyciu.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<Button
											variant="outline"
											onClick={() => setIsClearDialogOpen(false)}
										>
											Anuluj
										</Button>
										<Button
											onClick={() => {
												handleClearCache();
												setIsClearDialogOpen(false);
											}}
										>
											Wyczyść pamięć podręczną
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
