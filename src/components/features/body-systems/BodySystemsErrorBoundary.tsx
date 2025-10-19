"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import React from "react";

interface BodySystemsErrorBoundaryState {
	hasError: boolean;
	error?: Error;
	errorInfo?: React.ErrorInfo;
}

interface BodySystemsErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class BodySystemsErrorBoundary extends React.Component<
	BodySystemsErrorBoundaryProps,
	BodySystemsErrorBoundaryState
> {
	constructor(props: BodySystemsErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): BodySystemsErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error(
			"BodySystems Error Boundary caught an error:",
			error,
			errorInfo,
		);
		this.setState({ error, errorInfo });
		this.props.onError?.(error, errorInfo);
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: undefined, errorInfo: undefined });
	};

	handleGoHome = () => {
		window.location.href = "/";
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				const FallbackComponent = this.props.fallback;
				return (
					<FallbackComponent
						error={this.state.error}
						retry={this.handleRetry}
					/>
				);
			}

			return (
				<DefaultErrorFallback
					error={this.state.error}
					onRetry={this.handleRetry}
					onGoHome={this.handleGoHome}
				/>
			);
		}

		return this.props.children;
	}
}

interface ErrorFallbackProps {
	error?: Error;
	onRetry: () => void;
	onGoHome: () => void;
}

function DefaultErrorFallback({
	error,
	onRetry,
	onGoHome,
}: ErrorFallbackProps) {
	return (
		<div className="container mx-auto py-8">
			<Card className="mx-auto max-w-2xl">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
						<AlertTriangle className="h-6 w-6 text-red-600" />
					</div>
					<CardTitle className="text-red-800 text-xl">
						Wystąpił błąd w module układów ciała
					</CardTitle>
					<CardDescription>
						Przepraszamy za niedogodności. Nasz zespół został powiadomiony o
						problemie.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					<Alert>
						<AlertTriangle className="h-4 w-4" />
						<AlertDescription>
							Jeśli problem będzie się powtarzał, spróbuj odświeżyć stronę lub
							wróć do strony głównej.
						</AlertDescription>
					</Alert>

					{error && process.env.NODE_ENV === "development" && (
						<details className="text-sm">
							<summary className="mb-2 cursor-pointer font-medium text-gray-700">
								Szczegóły błędu (tylko dla deweloperów)
							</summary>
							<pre className="overflow-auto rounded bg-gray-100 p-3 text-xs">
								{error.stack}
							</pre>
						</details>
					)}

					<div className="flex justify-center gap-3">
						<Button onClick={onRetry} className="flex items-center gap-2">
							<RefreshCw className="h-4 w-4" />
							Spróbuj ponownie
						</Button>
						<Button
							variant="outline"
							onClick={onGoHome}
							className="flex items-center gap-2"
						>
							<Home className="h-4 w-4" />
							Strona główna
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

// Hook for error handling in functional components
export function useBodySystemsErrorHandler() {
	const [error, setError] = React.useState<Error | null>(null);

	const handleError = React.useCallback((error: Error) => {
		console.error("Body Systems Error:", error);
		setError(error);
	}, []);

	const clearError = React.useCallback(() => {
		setError(null);
	}, []);

	React.useEffect(() => {
		if (error) {
			// You could also send error to logging service here
			console.error("Body Systems component error:", error);
		}
	}, [error]);

	return { error, handleError, clearError };
}

// Error boundary wrapper for React functional components
export function withBodySystemsErrorBoundary<P extends object>(
	Component: React.ComponentType<P>,
	fallback?: React.ComponentType<{ error?: Error; retry: () => void }>,
) {
	return function WithErrorBoundaryComponent(props: P) {
		return (
			<BodySystemsErrorBoundary fallback={fallback}>
				<Component {...props} />
			</BodySystemsErrorBoundary>
		);
	};
}
