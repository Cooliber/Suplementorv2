"use client";

/**
 * Error Boundary Component
 * Graceful error handling with beautiful error UI
 */

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	override render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
					<Card className="w-full max-w-md">
						<CardHeader>
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
								<AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
							</div>
							<CardTitle>Coś poszło nie tak</CardTitle>
							<CardDescription>
								Wystąpił nieoczekiwany błąd. Przepraszamy za niedogodności.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{this.state.error && (
									<div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
										<p className="font-mono text-red-900 text-sm dark:text-red-100">
											{this.state.error.message}
										</p>
									</div>
								)}

								<div className="flex gap-2">
									<Button
										onClick={() => window.location.reload()}
										className="flex-1 gap-2"
									>
										<RefreshCw className="h-4 w-4" />
										Odśwież Stronę
									</Button>
									<Button
										variant="outline"
										onClick={() => (window.location.href = "/")}
										className="flex-1 gap-2"
									>
										<Home className="h-4 w-4" />
										Strona Główna
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			);
		}

		return this.props.children;
	}
}
