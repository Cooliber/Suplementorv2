"use client";

import { cn } from "@/lib/utils";
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle,
	Info,
	RefreshCw,
	Wifi,
	WifiOff,
} from "lucide-react";
import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";

export type ErrorSeverity = "low" | "medium" | "high" | "critical";
export type ErrorType =
	| "network"
	| "validation"
	| "permission"
	| "server"
	| "client"
	| "timeout"
	| "unknown";

export interface ErrorInfo {
	type: ErrorType;
	severity: ErrorSeverity;
	title: string;
	message: string;
	details?: string;
	timestamp: Date;
	retryable?: boolean;
	action?: {
		label: string;
		onClick: () => void;
	};
}

interface ErrorAlertProps {
	error: ErrorInfo;
	onRetry?: () => void;
	onDismiss?: () => void;
	className?: string;
	showIcon?: boolean;
	compact?: boolean;
}

const errorIcons = {
	network: WifiOff,
	validation: AlertTriangle,
	permission: AlertCircle,
	server: AlertTriangle,
	client: AlertCircle,
	timeout: RefreshCw,
	unknown: AlertCircle,
};

const errorVariants = {
	low: "default" as const,
	medium: "default" as const,
	high: "destructive" as const,
	critical: "destructive" as const,
};

export function ErrorAlert({
	error,
	onRetry,
	onDismiss,
	className,
	showIcon = true,
	compact = false,
}: ErrorAlertProps) {
	const Icon = errorIcons[error.type] || AlertCircle;

	const handleRetry = () => {
		if (error.retryable && onRetry) {
			onRetry();
		} else if (error.action) {
			error.action.onClick();
		}
	};

	return (
		<Alert
			variant={errorVariants[error.severity]}
			className={cn("w-full", className)}
		>
			{showIcon && <Icon className="h-4 w-4" />}
			<div className="flex-1">
				<AlertTitle className={cn(compact && "text-sm")}>
					{error.title}
				</AlertTitle>
				<AlertDescription className={cn("mt-2", compact && "text-sm")}>
					<div className="space-y-2">
						<p>{error.message}</p>
						{error.details && !compact && (
							<details className="text-muted-foreground text-xs">
								<summary className="cursor-pointer hover:text-foreground">
									Szczegóły błędu
								</summary>
								<p className="mt-2 rounded bg-muted p-2 font-mono text-xs">
									{error.details}
								</p>
							</details>
						)}
						<div className="mt-3 flex gap-2">
							{(error.retryable || error.action) && (
								<Button
									variant="outline"
									size={compact ? "sm" : "default"}
									onClick={handleRetry}
									className="flex items-center gap-2"
								>
									<RefreshCw className="h-3 w-3" />
									{error.action?.label || "Spróbuj ponownie"}
								</Button>
							)}
							{onDismiss && (
								<Button
									variant="ghost"
									size={compact ? "sm" : "default"}
									onClick={onDismiss}
								>
									Zamknij
								</Button>
							)}
						</div>
					</div>
				</AlertDescription>
			</div>
		</Alert>
	);
}

// Predefined error creators for common scenarios
export const createErrorInfo = {
	network: (message: string, details?: string): ErrorInfo => ({
		type: "network",
		severity: "medium",
		title: "Problem z połączeniem",
		message,
		details,
		timestamp: new Date(),
		retryable: true,
	}),

	validation: (message: string, details?: string): ErrorInfo => ({
		type: "validation",
		severity: "low",
		title: "Błąd walidacji",
		message,
		details,
		timestamp: new Date(),
		retryable: false,
	}),

	server: (message: string, details?: string): ErrorInfo => ({
		type: "server",
		severity: "high",
		title: "Błąd serwera",
		message,
		details,
		timestamp: new Date(),
		retryable: true,
	}),

	timeout: (message: string, details?: string): ErrorInfo => ({
		type: "timeout",
		severity: "medium",
		title: "Przekroczono limit czasu",
		message,
		details,
		timestamp: new Date(),
		retryable: true,
	}),

	permission: (message: string, details?: string): ErrorInfo => ({
		type: "permission",
		severity: "high",
		title: "Brak uprawnień",
		message,
		details,
		timestamp: new Date(),
		retryable: false,
	}),

	supplementLoad: (supplementName?: string): ErrorInfo => ({
		type: "server",
		severity: "medium",
		title: "Nie udało się załadować suplementu",
		message: supplementName
			? `Nie można załadować danych dla suplementu "${supplementName}". Sprawdź połączenie internetowe i spróbuj ponownie.`
			: "Nie udało się załadować danych suplementów. Sprawdź połączenie internetowe.",
		timestamp: new Date(),
		retryable: true,
	}),

	dosageCalculation: (details?: string): ErrorInfo => ({
		type: "validation",
		severity: "medium",
		title: "Błąd kalkulacji dawki",
		message:
			"Wystąpił błąd podczas obliczania dawki suplementu. Sprawdź wprowadzone wartości.",
		details,
		timestamp: new Date(),
		retryable: true,
	}),

	reviewSubmission: (details?: string): ErrorInfo => ({
		type: "server",
		severity: "medium",
		title: "Nie udało się wysłać opinii",
		message:
			"Wystąpił błąd podczas wysyłania opinii. Spróbuj ponownie za chwilę.",
		details,
		timestamp: new Date(),
		retryable: true,
	}),
};

export default ErrorAlert;
