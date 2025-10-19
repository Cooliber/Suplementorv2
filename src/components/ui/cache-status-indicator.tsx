"use client";

import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
	AlertCircle,
	CheckCircle,
	Clock,
	RefreshCw,
	Wifi,
	WifiOff,
} from "lucide-react";
import React from "react";

export type CacheStatus = "fresh" | "stale" | "expired" | "offline" | "syncing";

interface CacheStatusIndicatorProps {
	status: CacheStatus;
	lastUpdated?: Date | null;
	isOnline?: boolean;
	pendingChanges?: number;
	className?: string;
	showDetails?: boolean;
	onRefresh?: () => void;
}

const statusConfig = {
	fresh: {
		icon: CheckCircle,
		label: "Świeże dane",
		variant: "default" as const,
		color: "text-green-600",
	},
	stale: {
		icon: Clock,
		label: "Starsze dane",
		variant: "secondary" as const,
		color: "text-yellow-600",
	},
	expired: {
		icon: AlertCircle,
		label: "Wymaga odświeżenia",
		variant: "destructive" as const,
		color: "text-red-600",
	},
	offline: {
		icon: WifiOff,
		label: "Tryb offline",
		variant: "outline" as const,
		color: "text-gray-600",
	},
	syncing: {
		icon: RefreshCw,
		label: "Synchronizacja",
		variant: "secondary" as const,
		color: "text-blue-600",
	},
};

export function CacheStatusIndicator({
	status,
	lastUpdated,
	isOnline = true,
	pendingChanges = 0,
	className,
	showDetails = true,
	onRefresh,
}: CacheStatusIndicatorProps) {
	const config = statusConfig[status];
	const Icon = config.icon;

	const formatLastUpdated = (date: Date | null) => {
		if (!date) return "Nieznana";

		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMinutes = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMinutes / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMinutes < 1) return "Przed chwilą";
		if (diffMinutes < 60) return `${diffMinutes} min temu`;
		if (diffHours < 24) return `${diffHours}h temu`;
		return `${diffDays}d temu`;
	};

	const getTooltipContent = () => {
		const parts = [config.label];

		if (lastUpdated) {
			parts.push(`Ostatnia aktualizacja: ${formatLastUpdated(lastUpdated)}`);
		}

		if (!isOnline) {
			parts.push("Brak połączenia z internetem");
		}

		if (pendingChanges > 0) {
			parts.push(`${pendingChanges} oczekujących zmian`);
		}

		return parts.join("\n");
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className={cn("flex items-center gap-2", className)}>
						<Badge
							variant={config.variant}
							className={cn("flex items-center gap-1.5 text-xs", config.color)}
						>
							<Icon className="h-3 w-3" />
							{showDetails && (
								<>
									<span>{config.label}</span>
									{status === "syncing" && (
										<RefreshCw className="h-3 w-3 animate-spin" />
									)}
								</>
							)}
						</Badge>

						{pendingChanges > 0 && (
							<Badge variant="outline" className="text-xs">
								{pendingChanges}
							</Badge>
						)}

						{onRefresh && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									onRefresh();
								}}
								className="rounded p-1 transition-colors hover:bg-gray-100"
								aria-label="Odśwież dane"
							>
								<RefreshCw className="h-3 w-3" />
							</button>
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<div className="whitespace-pre-line text-sm">
						{getTooltipContent()}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

// Compact version for inline use
export function CacheStatusDot({
	status,
	className,
}: {
	status: CacheStatus;
	className?: string;
}) {
	const config = statusConfig[status];

	return (
		<div
			className={cn(
				"h-2 w-2 rounded-full",
				status === "fresh" && "bg-green-500",
				status === "stale" && "bg-yellow-500",
				status === "expired" && "bg-red-500",
				status === "offline" && "bg-gray-500",
				status === "syncing" && "animate-pulse bg-blue-500",
				className,
			)}
			title={config.label}
		/>
	);
}
