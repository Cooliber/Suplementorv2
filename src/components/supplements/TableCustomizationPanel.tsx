/**
 * Table Customization Panel
 * Provides comprehensive table customization options
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
	Download,
	Eye,
	EyeOff,
	Grid,
	List,
	Palette,
	RotateCcw,
	Save,
	Settings,
} from "lucide-react";
import React from "react";

import { DEFAULT_COLUMNS } from "./table-config";
import type { TableCustomizationPanelProps } from "./types";

export function TableCustomizationPanel({
	customization,
	availableColumns,
	onCustomizationChange,
	className = "",
}: TableCustomizationPanelProps) {
	const handleDensityChange = (value: string) => {
		onCustomizationChange({
			...customization,
			density: value as "compact" | "normal" | "comfortable",
		});
	};

	const handleColumnToggle = (columnKey: string) => {
		const newVisibleColumns = customization.visibleColumns.includes(columnKey)
			? customization.visibleColumns.filter((col) => col !== columnKey)
			: [...customization.visibleColumns, columnKey];

		onCustomizationChange({
			...customization,
			visibleColumns: newVisibleColumns,
		});
	};

	const handleShowBordersToggle = () => {
		onCustomizationChange({
			...customization,
			showBorders: !customization.showBorders,
		});
	};

	const handleHighlightDifferencesToggle = () => {
		onCustomizationChange({
			...customization,
			highlightDifferences: !customization.highlightDifferences,
		});
	};

	const resetToDefaults = () => {
		onCustomizationChange({
			visibleColumns: DEFAULT_COLUMNS.filter(
				(col) => col.key !== "visibility",
			).map((col) => col.key),
			density: "normal",
			showBorders: true,
			highlightDifferences: true,
		});
	};

	const saveCustomization = () => {
		// Save to localStorage or user preferences
		localStorage.setItem(
			"supplement-table-customization",
			JSON.stringify(customization),
		);
	};

	const loadCustomization = () => {
		try {
			const saved = localStorage.getItem("supplement-table-customization");
			if (saved) {
				const parsedCustomization = JSON.parse(saved);
				onCustomizationChange(parsedCustomization);
			}
		} catch (error) {
			console.error("Failed to load saved customization:", error);
		}
	};

	// Density options with Polish labels
	const densityOptions = [
		{
			value: "compact",
			label: "Kompaktowy",
			description: "Mały odstęp, więcej danych",
		},
		{ value: "normal", label: "Normalny", description: "Standardowy odstęp" },
		{
			value: "comfortable",
			label: "Komfortowy",
			description: "Duży odstęp, łatwiejszy do czytania",
		},
	];

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Settings className="h-5 w-5" />
					Dostosuj tabelę
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[400px]">
					<div className="space-y-6">
						{/* Density Settings */}
						<div>
							<Label className="mb-3 block font-medium text-base">
								Gęstość tabeli
							</Label>
							<Select
								value={customization.density}
								onValueChange={handleDensityChange}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{densityOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<div>
												<div className="font-medium">{option.label}</div>
												<div className="text-muted-foreground text-sm">
													{option.description}
												</div>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<Separator />

						{/* Column Visibility */}
						<div>
							<Label className="mb-3 block font-medium text-base">
								Widoczne kolumny
							</Label>
							<div className="space-y-2">
								{DEFAULT_COLUMNS.map((column) => (
									<div
										key={column.key}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<Switch
												checked={customization.visibleColumns.includes(
													column.key,
												)}
												onCheckedChange={() => handleColumnToggle(column.key)}
												disabled={column.key === "name"} // Name column should always be visible
											/>
											<span className="text-sm">{column.polishLabel}</span>
										</div>
										{column.key === "name" && (
											<Badge variant="outline" className="text-xs">
												Wymagane
											</Badge>
										)}
									</div>
								))}
							</div>
						</div>

						<Separator />

						{/* Display Options */}
						<div>
							<Label className="mb-3 block font-medium text-base">
								Opcje wyświetlania
							</Label>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<Label className="font-medium text-sm">
											Obramowania tabeli
										</Label>
										<p className="text-muted-foreground text-xs">
											Pokaż linie siatki w tabeli
										</p>
									</div>
									<Switch
										checked={customization.showBorders}
										onCheckedChange={handleShowBordersToggle}
									/>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<Label className="font-medium text-sm">
											Podświetlanie różnic
										</Label>
										<p className="text-muted-foreground text-xs">
											Wyróżnij różnice między suplementami
										</p>
									</div>
									<Switch
										checked={customization.highlightDifferences}
										onCheckedChange={handleHighlightDifferencesToggle}
									/>
								</div>
							</div>
						</div>

						<Separator />

						{/* Quick Presets */}
						<div>
							<Label className="mb-3 block font-medium text-base">
								Szybkie ustawienia
							</Label>
							<div className="grid grid-cols-2 gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleDensityChange("compact")}
									className="justify-start"
								>
									<Grid className="mr-2 h-4 w-4" />
									Kompaktowy
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleDensityChange("comfortable")}
									className="justify-start"
								>
									<List className="mr-2 h-4 w-4" />
									Komfortowy
								</Button>
							</div>
						</div>

						<Separator />

						{/* Column Statistics */}
						<div>
							<Label className="mb-3 block font-medium text-base">
								Statystyki kolumn
							</Label>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span>Dostępne kolumny:</span>
									<Badge variant="outline">{DEFAULT_COLUMNS.length}</Badge>
								</div>
								<div className="flex justify-between">
									<span>Widoczne kolumny:</span>
									<Badge variant="outline">
										{customization.visibleColumns.length}
									</Badge>
								</div>
								<div className="flex justify-between">
									<span>Ukryte kolumny:</span>
									<Badge variant="outline">
										{DEFAULT_COLUMNS.length -
											customization.visibleColumns.length}
									</Badge>
								</div>
							</div>
						</div>

						<Separator />

						{/* Action Buttons */}
						<div className="space-y-2">
							<div className="grid grid-cols-2 gap-2">
								<Button variant="outline" size="sm" onClick={loadCustomization}>
									<Download className="mr-2 h-4 w-4" />
									Załaduj
								</Button>
								<Button variant="outline" size="sm" onClick={saveCustomization}>
									<Save className="mr-2 h-4 w-4" />
									Zapisz
								</Button>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={resetToDefaults}
								className="w-full"
							>
								<RotateCcw className="mr-2 h-4 w-4" />
								Przywróć domyślne
							</Button>
						</div>
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
