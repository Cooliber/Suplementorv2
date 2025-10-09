"use client";

/**
 * Complete Supplement Filter System
 * Integrated filtering solution with all advanced features
 */

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AdvancedSupplementFilters } from "./AdvancedSupplementFilters";
import { DetailedFilterPopover } from "./DetailedFilterPopover";
import { useFilters } from "@/hooks/useFilters";
import { filterSupplements, analyzeFilters, extractFilterOptions } from "@/lib/filters/filterLogic";
import type { SupplementWithRelations } from "@/types/supplement";
import {
	Search,
	Filter,
	BarChart3,
	TrendingUp,
	Info,
	AlertCircle,
	CheckCircle,
	Clock,
} from "lucide-react";

interface SupplementFilterSystemProps {
	supplements: SupplementWithRelations[];
	onFilteredResults?: (results: SupplementWithRelations[]) => void;
	isLoading?: boolean;
	error?: string;
}

export function SupplementFilterSystem({
	supplements,
	onFilteredResults,
	isLoading = false,
	error,
}: SupplementFilterSystemProps) {
	const {
		filters,
		updateFilter,
		clearFilters,
		hasActiveFilters,
		activeFilterCount,
		analytics,
	} = useFilters();

	// Extract available filter options from supplements
	const filterOptions = useMemo(() =>
		extractFilterOptions(supplements),
		[supplements]
	);

	// Filter analysis
	const filterAnalysis = useMemo(() =>
		analyzeFilters(filters),
		[filters]
	);

	// Apply filters to supplements
	const filteredSupplements = useMemo(() => {
		if (isLoading || !supplements.length) return [];

		try {
			const results = filterSupplements(supplements, filters);
			onFilteredResults?.(results);
			return results;
		} catch (err) {
			console.error("Error filtering supplements:", err);
			return [];
		}
	}, [supplements, filters, isLoading, onFilteredResults]);

	// Handle filter changes
	const handleFiltersChange = (newFilters: any) => {
		// This is handled by the useFilters hook
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="space-y-4">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-64" />
					</CardHeader>
					<CardContent className="space-y-4">
						<Skeleton className="h-10 w-full" />
						<div className="flex gap-2">
							<Skeleton className="h-8 w-20" />
							<Skeleton className="h-8 w-24" />
							<Skeleton className="h-8 w-28" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertDescription>
					Wystąpił błąd podczas ładowania suplementów: {error}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-6">
			{/* Main Filter Interface */}
			<AdvancedSupplementFilters
				onFiltersChange={handleFiltersChange}
				availableCompounds={filterOptions.compounds}
				availableConditions={filterOptions.conditions}
				availableMechanisms={filterOptions.mechanisms}
				availableSideEffects={filterOptions.sideEffects}
				availableTags={filterOptions.tags}
				isLoading={isLoading}
			/>

			{/* Filter Analysis and Results Info */}
			<div className="grid gap-4 lg:grid-cols-3">
				{/* Results Summary */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-lg flex items-center gap-2">
							<Search className="h-5 w-5" />
							Wyniki filtrowania
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Znalezione suplementy</span>
							<Badge variant="outline" className="font-mono">
								{filteredSupplements.length} / {supplements.length}
							</Badge>
						</div>

						{hasActiveFilters && (
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Aktywne filtry</span>
								<Badge variant="secondary">
									{activeFilterCount}
								</Badge>
							</div>
						)}

						{filterAnalysis.performance !== "fast" && (
							<Alert>
								<Clock className="h-4 w-4" />
								<AlertDescription className="text-xs">
									{filterAnalysis.performance === "medium"
										? "Średnia wydajność filtrowania"
										: "Wolne filtrowanie - rozważ mniej filtrów"}
								</AlertDescription>
							</Alert>
						)}
					</CardContent>
				</Card>

				{/* Filter Performance */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-lg flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							Analiza filtrów
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Złożoność</span>
							<Badge variant={
								filterAnalysis.complexity > 15 ? "destructive" :
								filterAnalysis.complexity > 10 ? "secondary" : "outline"
							}>
								{filterAnalysis.complexity}/20
							</Badge>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Szacowana wydajność</span>
							<Badge variant={
								filterAnalysis.performance === "fast" ? "default" :
								filterAnalysis.performance === "medium" ? "secondary" : "destructive"
							}>
								{filterAnalysis.performance === "fast" ? "Szybkie" :
								 filterAnalysis.performance === "medium" ? "Średnie" : "Wolne"}
							</Badge>
						</div>

						{filterAnalysis.estimatedResults < 10 && (
							<Alert>
								<Info className="h-4 w-4" />
								<AlertDescription className="text-xs">
									Szacowane wyniki: {filterAnalysis.estimatedResults}
									{filterAnalysis.estimatedResults === 1 ? " suplement" : " suplementów"}
								</AlertDescription>
							</Alert>
						)}
					</CardContent>
				</Card>

				{/* Popular Filters */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-lg flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Popularne filtry
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{analytics.popularCategories.slice(0, 3).map((item) => (
								<div key={item.category} className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">
										{item.category === "NOOTROPIC" ? "Nootropiki" :
										 item.category === "HERB" ? "Zioła" :
										 item.category === "VITAMIN" ? "Witaminy" :
										 item.category}
									</span>
									<Badge variant="outline" className="text-xs">
										{item.count}
									</Badge>
								</div>
							))}

							{analytics.popularCategories.length === 0 && (
								<p className="text-sm text-muted-foreground">
									Brak danych o popularnych filtrach
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filter Recommendations */}
			{filterAnalysis.recommendations.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<CheckCircle className="h-5 w-5 text-green-600" />
							Rekomendacje
						</CardTitle>
						<CardDescription>
							Sugestie dotyczące optymalizacji filtrów
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{filterAnalysis.recommendations.map((recommendation, index) => (
								<li key={index} className="flex items-start gap-2 text-sm">
									<CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
									{recommendation}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}

			{/* Advanced Filter Details */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Szczegółowe opcje filtrowania</CardTitle>
					<CardDescription>
						Dostęp do wszystkich zaawansowanych opcji filtrowania w zorganizowanym interfejsie
					</CardDescription>
				</CardHeader>
				<CardContent>
					<DetailedFilterPopover
						availableCompounds={filterOptions.compounds}
						availableConditions={filterOptions.conditions}
						availableMechanisms={filterOptions.mechanisms}
						availableSideEffects={filterOptions.sideEffects}
						availableTags={filterOptions.tags}
						onFiltersChange={handleFiltersChange}
					>
						<Button variant="outline" className="w-full">
							<Filter className="h-4 w-4 mr-2" />
							Otwórz szczegółowe filtry
							{hasActiveFilters && (
								<Badge variant="secondary" className="ml-2">
									{activeFilterCount}
								</Badge>
							)}
						</Button>
					</DetailedFilterPopover>
				</CardContent>
			</Card>

			{/* Filter State Info (for debugging) */}
			{process.env.NODE_ENV === "development" && (
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Debug: Stan filtrów</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-32">
							{JSON.stringify({
								activeFilters: activeFilterCount,
								complexity: filterAnalysis.complexity,
								performance: filterAnalysis.performance,
								results: filteredSupplements.length,
								currentFilters: filters,
							}, null, 2)}
						</pre>
					</CardContent>
				</Card>
			)}
		</div>
	);
}