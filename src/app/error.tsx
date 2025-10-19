'use client';

/**
 * Global Error Page for Suplementor Medical App
 * Provides user-friendly error handling with Polish localization
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw, Phone } from 'lucide-react';

interface ErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	// Log error for monitoring (in production, send to error tracking service)
	React.useEffect(() => {
		console.error('Application error:', error);

		// In production, you might want to send this to an error tracking service
		if (process.env.NODE_ENV === 'production') {
			// Example: Sentry, LogRocket, or custom error tracking
			// errorTracker.captureException(error);
		}
	}, [error]);

	const handleRetry = () => {
		reset();
	};

	const handleGoHome = () => {
		window.location.href = '/';
	};

	const handleContactSupport = () => {
		// In a real app, this might open a support chat or email client
		window.location.href = 'mailto:support@suplementor.pl?subject=Błąd aplikacji&body=Opisz błąd...';
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
						<AlertTriangle className="w-8 h-8 text-red-600" />
					</div>
					<CardTitle className="text-2xl font-bold text-gray-900">
						Wystąpił błąd
					</CardTitle>
					<CardDescription className="text-gray-600 mt-2">
						Przepraszamy za niedogodności. Coś poszło nie tak.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Error details for development */}
					{process.env.NODE_ENV === 'development' && (
						<div className="bg-gray-50 p-3 rounded-md">
							<p className="text-sm font-medium text-gray-700 mb-1">
								Szczegóły błędu (tylko w trybie deweloperskim):
							</p>
							<p className="text-xs text-gray-600 font-mono break-all">
								{error.message}
							</p>
							{error.digest && (
								<p className="text-xs text-gray-500 mt-1">
									ID błędu: {error.digest}
								</p>
							)}
						</div>
					)}

					{/* Medical app specific guidance */}
					<div className="bg-blue-50 p-3 rounded-md">
						<p className="text-sm text-blue-800">
							<strong>Ważne:</strong> Jeśli błąd dotyczy informacji medycznych lub suplementów,
							skonsultuj się z lekarzem lub farmaceutą przed kontynuowaniem użytkowania aplikacji.
						</p>
					</div>

					{/* Action buttons */}
					<div className="space-y-3">
						<Button
							onClick={handleRetry}
							className="w-full"
							variant="default"
						>
							<RefreshCw className="w-4 h-4 mr-2" />
							Spróbuj ponownie
						</Button>

						<Button
							onClick={handleGoHome}
							className="w-full"
							variant="outline"
						>
							<Home className="w-4 h-4 mr-2" />
							Przejdź do strony głównej
						</Button>

						<Button
							onClick={handleContactSupport}
							className="w-full"
							variant="outline"
						>
							<Phone className="w-4 h-4 mr-2" />
							Skontaktuj się z obsługą
						</Button>
					</div>

					{/* Additional help */}
					<div className="text-center pt-4 border-t">
						<p className="text-sm text-gray-500">
							Potrzebujesz pomocy?
						</p>
						<a
							href="mailto:support@suplementor.pl"
							className="text-sm text-blue-600 hover:text-blue-800 underline"
						>
							support@suplementor.pl
						</a>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}