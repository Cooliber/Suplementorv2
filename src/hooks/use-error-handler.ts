"use client";

import { type ErrorInfo, createErrorInfo } from "@/components/ui/error-alert";
import { useCallback, useState } from "react";
import { useToast } from "./use-toast";

interface ErrorState {
	errors: ErrorInfo[];
	isLoading: boolean;
}

interface UseErrorHandlerOptions {
	showToast?: boolean;
	maxErrors?: number;
	autoRetry?: boolean;
	retryDelay?: number;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
	const {
		showToast = true,
		maxErrors = 5,
		autoRetry = false,
		retryDelay = 1000,
	} = options;

	const { toast } = useToast();
	const [errorState, setErrorState] = useState<ErrorState>({
		errors: [],
		isLoading: false,
	});

	const addError = useCallback(
		(error: ErrorInfo) => {
			setErrorState((prev) => {
				const newErrors = [error, ...prev.errors].slice(0, maxErrors);
				return { ...prev, errors: newErrors };
			});

			if (showToast) {
				toast({
					variant:
						error.severity === "critical" || error.severity === "high"
							? "destructive"
							: "default",
					title: error.title,
					description: error.message,
				});
			}
		},
		[toast, showToast, maxErrors],
	);

	const clearError = useCallback((errorId?: string) => {
		if (errorId) {
			setErrorState((prev) => ({
				...prev,
				errors: prev.errors.filter((error) => {
					// Use timestamp as ID since we don't have explicit IDs
					const errorTimestamp = error.timestamp.getTime().toString();
					return errorTimestamp !== errorId;
				}),
			}));
		} else {
			setErrorState((prev) => ({ ...prev, errors: [] }));
		}
	}, []);

	const clearErrors = useCallback(() => {
		setErrorState((prev) => ({ ...prev, errors: [] }));
	}, []);

	const retryLastError = useCallback(async () => {
		const lastError = errorState.errors[0];
		if (!lastError || !lastError.retryable) return;

		setErrorState((prev) => ({ ...prev, isLoading: true }));

		try {
			// Simulate retry delay
			await new Promise((resolve) => setTimeout(resolve, retryDelay));

			if (lastError.action?.onClick) {
				lastError.action.onClick();
			}

			// Remove the error after successful retry
			clearError(lastError.timestamp.getTime().toString());
		} catch (retryError) {
			// Add a new error for the failed retry
			addError(
				createErrorInfo.server(
					"Ponowna próba nie powiodła się. Spróbuj ponownie za chwilę.",
					retryError instanceof Error
						? retryError.message
						: "Unknown retry error",
				),
			);
		} finally {
			setErrorState((prev) => ({ ...prev, isLoading: false }));
		}
	}, [errorState.errors, retryDelay, clearError, addError]);

	const handleError = useCallback(
		(error: unknown, context?: string) => {
			let errorInfo: ErrorInfo;

			if (error instanceof Error) {
				errorInfo = createErrorInfo.server(
					context ? `${context}: ${error.message}` : error.message,
					error.stack,
				);
			} else if (typeof error === "string") {
				errorInfo = createErrorInfo.server(error);
			} else {
				errorInfo = createErrorInfo.server(
					"Wystąpił nieoczekiwany błąd",
					context || "Unknown error context",
				);
			}

			addError(errorInfo);
			return errorInfo;
		},
		[addError],
	);

	const handleNetworkError = useCallback(
		(context?: string) => {
			const errorInfo = createErrorInfo.network(
				"Sprawdź połączenie internetowe i spróbuj ponownie.",
				context,
			);
			addError(errorInfo);
			return errorInfo;
		},
		[addError],
	);

	const handleValidationError = useCallback(
		(message: string, details?: string) => {
			const errorInfo = createErrorInfo.validation(message, details);
			addError(errorInfo);
			return errorInfo;
		},
		[addError],
	);

	const handleSupplementError = useCallback(
		(supplementName?: string, details?: string) => {
			const errorInfo = createErrorInfo.supplementLoad(supplementName);
			if (details) {
				errorInfo.details = details;
			}
			addError(errorInfo);
			return errorInfo;
		},
		[addError],
	);

	const handleDosageError = useCallback(
		(details?: string) => {
			const errorInfo = createErrorInfo.dosageCalculation(details);
			addError(errorInfo);
			return errorInfo;
		},
		[addError],
	);

	const handleReviewError = useCallback(
		(details?: string) => {
			const errorInfo = createErrorInfo.reviewSubmission(details);
			addError(errorInfo);
			return errorInfo;
		},
		[addError],
	);

	return {
		errors: errorState.errors,
		isLoading: errorState.isLoading,
		addError,
		clearError,
		clearErrors,
		retryLastError,
		handleError,
		handleNetworkError,
		handleValidationError,
		handleSupplementError,
		handleDosageError,
		handleReviewError,
	};
}

export default useErrorHandler;
