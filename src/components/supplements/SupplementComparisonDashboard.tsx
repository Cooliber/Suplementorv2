/**
 * Main Supplement Comparison Dashboard
 * Combines table view and comparison view with responsive layout
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List, Maximize2, Minimize2 } from "lucide-react";
import React, { useState, useEffect } from "react";

import type { SupplementWithRelations } from "@/types/supplement";
import { ComparisonView } from "./ComparisonView";
import { SupplementComparisonTable } from "./SupplementComparisonTable";

interface SupplementComparisonDashboardProps {
	supplements?: SupplementWithRelations[];
	onSelectionChange?: (selectedIds: string[]) => void;
	onExport?: (data: any[], format: string) => void;
	className?: string;
	defaultView?: "table" | "split" | "comparison";
}

export function SupplementComparisonDashboard({
	supplements = [],
	onSelectionChange,
	onExport,
	className = "",
	defaultView = "table",
}: SupplementComparisonDashboardProps) {
	const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
	const [viewMode, setViewMode] = useState<"table" | "split" | "comparison">(
		defaultView,
	);
	const [isFullscreen, setIsFullscreen] = useState(false);

	// Handle selection changes from table
	const handleSelectionChange = (newSelectedIds: string[]) => {
		setSelectedSupplements(newSelectedIds);
		onSelectionChange?.(newSelectedIds);
	};

	// Get selected supplement objects
	const selectedSupplementObjects = supplements.filter((s) =>
		selectedSupplements.includes(s.id),
	);

	// Handle supplement removal from comparison
	const handleRemoveSupplement = (id: string) => {
		const newSelection = selectedSupplements.filter((sid) => sid !== id);
		setSelectedSupplements(newSelection);
		onSelectionChange?.(newSelection);
	};

	// Toggle fullscreen mode
	const toggleFullscreen = () => {
		setIsFullscreen(!isFullscreen);
	};

	if (isFullscreen) {
		return (
			<div className="fixed inset-0 z-50 overflow-hidden bg-background">
				<div className="flex items-center justify-between border-b p-4">
					<h2 className="font-semibold text-lg">Porównanie suplementów</h2>
					<div className="flex items-center gap-2">
						<Badge variant="secondary">
							{selectedSupplements.length} wybranych
						</Badge>
						<Button variant="outline" size="sm" onClick={toggleFullscreen}>
							<Minimize2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
				<div className="flex-1 overflow-hidden">
					<ComparisonView
						selectedSupplements={selectedSupplementObjects}
						onRemove={handleRemoveSupplement}
						className="h-full rounded-none border-0"
					/>
				</div>
			</div>
		);
	}

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Header Controls */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
						<div>
							<h2 className="font-bold text-2xl">Porównanie suplementów</h2>
							<p className="text-muted-foreground">
								Porównaj suplementy, analizuj interakcje i znajdź najlepsze
								rozwiązania
							</p>
						</div>

						<div className="flex items-center gap-2">
							{/* View Mode Toggle */}
							<div className="flex items-center rounded-lg border p-1">
								<Button
									variant={viewMode === "table" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("table")}
									className="h-8"
								>
									<List className="mr-1 h-4 w-4" />
									Tabela
								</Button>
								<Button
									variant={viewMode === "split" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("split")}
									className="h-8"
								>
									<Grid className="mr-1 h-4 w-4" />
									Podzielony
								</Button>
								<Button
									variant={viewMode === "comparison" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("comparison")}
									className="h-8"
								>
									Porównanie
								</Button>
							</div>

							{/* Fullscreen Toggle */}
							{selectedSupplements.length > 0 && (
								<Button variant="outline" size="sm" onClick={toggleFullscreen}>
									<Maximize2 className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>

					{/* Selection Summary */}
					{selectedSupplements.length > 0 && (
						<>
							<Separator className="my-4" />
							<div className="flex flex-wrap items-center gap-2">
								<span className="font-medium text-sm">Wybrane suplementy:</span>
								{selectedSupplementObjects.map((supplement) => (
									<Badge
										key={supplement.id}
										variant="secondary"
										className="cursor-pointer"
										onClick={() => handleRemoveSupplement(supplement.id)}
									>
										{supplement.name}
										<span className="ml-1 text-xs">×</span>
									</Badge>
								))}
							</div>
						</>
					)}
				</CardContent>
			</Card>

			{/* Main Content */}
			{viewMode === "table" && (
				<SupplementComparisonTable
					supplements={supplements}
					onSelectionChange={handleSelectionChange}
					onExport={onExport}
					maxSelection={5}
				/>
			)}

			{viewMode === "comparison" && (
				<ComparisonView
					selectedSupplements={selectedSupplementObjects}
					onRemove={handleRemoveSupplement}
				/>
			)}

			{viewMode === "split" && (
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="space-y-4">
						<Card>
							<CardContent className="pt-6">
								<h3 className="mb-4 font-semibold">Tabela suplementów</h3>
								<SupplementComparisonTable
									supplements={supplements}
									onSelectionChange={handleSelectionChange}
									onExport={onExport}
									maxSelection={5}
									showCustomization={false}
									showExport={false}
								/>
							</CardContent>
						</Card>
					</div>

					<div className="space-y-4">
						<ComparisonView
							selectedSupplements={selectedSupplementObjects}
							onRemove={handleRemoveSupplement}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
