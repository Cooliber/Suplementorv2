'use client';

/**
 * 404 Not Found Page for Suplementor Medical App
 * Provides helpful navigation and search for missing pages
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Home, ArrowLeft, BookOpen, Pill, Brain } from 'lucide-react';

export default function NotFoundPage() {
	const [searchQuery, setSearchQuery] = React.useState('');

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			// Redirect to search page with query
			window.location.href = `/wyszukiwanie?q=${encodeURIComponent(searchQuery)}`;
		}
	};

	const handleGoHome = () => {
		window.location.href = '/';
	};

	const handleGoBack = () => {
		window.history.back();
	};

	// Popular medical content sections for quick navigation
	const quickLinks = [
		{ name: 'Suplementy', href: '/suplementy', icon: Pill, description: 'Baza suplementów i nootropików' },
		{ name: 'Wiedza', href: '/wiedza', icon: Brain, description: 'Edukacja o mózgu i funkcjach poznawczych' },
		{ name: 'Poradniki', href: '/poradniki', icon: BookOpen, description: 'Praktyczne przewodniki i artykuły' },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader className="text-center">
					<div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
						<Search className="w-8 h-8 text-blue-600" />
					</div>
					<CardTitle className="text-3xl font-bold text-gray-900">
						404 - Strona nie znaleziona
					</CardTitle>
					<CardDescription className="text-lg text-gray-600 mt-2">
						Nie możemy znaleźć strony, której szukasz. Może została przeniesiona lub usunięta.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Search form */}
					<form onSubmit={handleSearch} className="space-y-3">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								type="text"
								placeholder="Szukaj suplementów, informacji medycznych..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Button type="submit" className="w-full">
							Szukaj w aplikacji
						</Button>
					</form>

					{/* Quick navigation */}
					<div className="space-y-3">
						<h3 className="font-semibold text-gray-900">Popularne sekcje:</h3>
						<div className="grid gap-3">
							{quickLinks.map((link) => {
								const Icon = link.icon;
								return (
									<a
										key={link.href}
										href={link.href}
										className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
									>
										<Icon className="w-5 h-5 text-blue-600 mr-3" />
										<div className="flex-1">
											<div className="font-medium text-gray-900">{link.name}</div>
											<div className="text-sm text-gray-600">{link.description}</div>
										</div>
									</a>
								);
							})}
						</div>
					</div>

					{/* Action buttons */}
					<div className="flex flex-col sm:flex-row gap-3">
						<Button onClick={handleGoHome} className="flex-1">
							<Home className="w-4 h-4 mr-2" />
							Strona główna
						</Button>
						<Button onClick={handleGoBack} variant="outline" className="flex-1">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Wstecz
						</Button>
					</div>

					{/* Medical disclaimer */}
					<div className="bg-amber-50 p-3 rounded-md">
						<p className="text-sm text-amber-800">
							<strong>Uwaga medyczna:</strong> Informacje na tej stronie mają charakter edukacyjny.
							Zawsze konsultuj się z lekarzem przed wprowadzeniem zmian w suplementacji.
						</p>
					</div>

					{/* Help section */}
					<div className="text-center pt-4 border-t">
						<p className="text-sm text-gray-500 mb-2">
							Nadal potrzebujesz pomocy?
						</p>
						<div className="space-y-1">
							<a
								href="/kontakt"
								className="block text-sm text-blue-600 hover:text-blue-800 underline"
							>
								Skontaktuj się z nami
							</a>
							<a
								href="/pomoc"
								className="block text-sm text-blue-600 hover:text-blue-800 underline"
							>
								Centrum pomocy
							</a>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}