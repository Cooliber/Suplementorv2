"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
	Download,
	Eye,
	EyeOff,
	FileText,
	Maximize2,
	Minimize2,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

export interface ExportableData {
	[key: string]: any;
}

export interface ExportConfiguration {
	format: "csv" | "json" | "pdf" | "excel";
	filename: string;
	selectedColumns: string[];
	includeAllColumns: boolean;
	filters?: Record<string, any>;
	formatting?: {
		dateFormat?: string;
		numberFormat?: string;
		includeHeaders?: boolean;
	};
	preview?: boolean;
}

export interface ExportPreviewProps {
	data: ExportableData[];
	configuration: ExportConfiguration;
	maxPreviewRows?: number;
	className?: string;
}

export const ExportPreview: React.FC<ExportPreviewProps> = ({
	data,
	configuration,
	maxPreviewRows = 10,
	className,
}) => {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());

	// Filter and prepare preview data
	const previewData = useMemo(() => {
		let filteredData = data;

		// Apply column selection
		if (
			!configuration.includeAllColumns &&
			configuration.selectedColumns.length > 0
		) {
			filteredData = data.map((row) => {
				const filteredRow: ExportableData = {};
				configuration.selectedColumns.forEach((col) => {
					if (row[col] !== undefined) {
						filteredRow[col] = row[col];
					}
				});
				return filteredRow;
			});
		}

		// Limit rows for preview
		return filteredData.slice(0, maxPreviewRows);
	}, [
		data,
		configuration.selectedColumns,
		configuration.includeAllColumns,
		maxPreviewRows,
	]);

	// Get available columns for preview
	const availableColumns = useMemo(() => {
		if (previewData.length === 0) return [];
		const firstRow = previewData[0];
		if (!firstRow) return [];
		return Object.keys(firstRow).map((key) => ({
			key,
			label: key,
			polishLabel: key,
			type: typeof firstRow[key],
		}));
	}, [previewData]);

	// Format cell value based on type and configuration
	const formatCellValue = (value: any, columnType?: string): string => {
		if (value === null || value === undefined) {
			return "-";
		}

		switch (columnType) {
			case "number":
				return typeof value === "number"
					? value.toLocaleString("pl-PL")
					: String(value);
			case "boolean":
				return value ? "Tak" : "Nie";
			case "object":
				return JSON.stringify(value);
			default:
				return String(value);
		}
	};

	// Generate preview based on format
	const renderFormatPreview = () => {
		switch (configuration.format) {
			case "csv":
				return renderCSVPreview();
			case "json":
				return renderJSONPreview();
			case "excel":
				return renderTablePreview();
			case "pdf":
				return renderPDFPreview();
			default:
				return renderTablePreview();
		}
	};

	const renderCSVPreview = () => (
		<div className="space-y-2">
			<div className="mb-2 font-medium text-muted-foreground text-sm">
				Podgląd CSV:
			</div>
			<div className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-sm">
				{availableColumns.map((col) => col.key).join(",")}
				<br />
				{previewData.map((row, index) => (
					<div key={index}>
						{availableColumns
							.map((col) => {
								const value = row[col.key];
								const formatted = formatCellValue(value, col.type);
								return `"${formatted}"`;
							})
							.join(",")}
						<br />
					</div>
				))}
			</div>
		</div>
	);

	const renderJSONPreview = () => (
		<div className="space-y-2">
			<div className="mb-2 font-medium text-muted-foreground text-sm">
				Podgląd JSON:
			</div>
			<div className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-sm">
				<pre>{JSON.stringify(previewData, null, 2)}</pre>
			</div>
		</div>
	);

	const renderTablePreview = () => (
		<div className="space-y-2">
			<div className="mb-2 font-medium text-muted-foreground text-sm">
				Podgląd tabeli:
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							{availableColumns
								.filter((col) => !hiddenColumns.has(col.key))
								.map((column) => (
									<TableHead key={column.key} className="font-medium">
										{column.polishLabel || column.label}
									</TableHead>
								))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{previewData.map((row, rowIndex) => (
							<TableRow key={rowIndex}>
								{availableColumns
									.filter((col) => !hiddenColumns.has(col.key))
									.map((column) => (
										<TableCell key={column.key}>
											{formatCellValue(row[column.key], column.type)}
										</TableCell>
									))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);

	const renderPDFPreview = () => (
		<div className="space-y-2">
			<div className="mb-2 font-medium text-muted-foreground text-sm">
				Podgląd PDF:
			</div>
			<div className="rounded-md border bg-white p-4">
				<div className="mb-4 border-b pb-2 text-center">
					<h2 className="font-semibold text-lg">Eksport danych</h2>
					<p className="text-muted-foreground text-sm">
						Wygenerowano: {new Date().toLocaleDateString("pl-PL")}
					</p>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							{availableColumns
								.filter((col) => !hiddenColumns.has(col.key))
								.map((column) => (
									<TableHead key={column.key} className="font-medium">
										{column.polishLabel || column.label}
									</TableHead>
								))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{previewData.map((row, rowIndex) => (
							<TableRow key={rowIndex}>
								{availableColumns
									.filter((col) => !hiddenColumns.has(col.key))
									.map((column) => (
										<TableCell key={column.key}>
											{formatCellValue(row[column.key], column.type)}
										</TableCell>
									))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);

	const toggleColumnVisibility = (columnKey: string) => {
		setHiddenColumns((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(columnKey)) {
				newSet.delete(columnKey);
			} else {
				newSet.add(columnKey);
			}
			return newSet;
		});
	};

	if (previewData.length === 0) {
		return (
			<Card className={className}>
				<CardContent className="flex h-48 items-center justify-center">
					<div className="text-center text-muted-foreground">
						<FileText className="mx-auto mb-4 h-12 w-12" />
						<p>Brak danych do podglądu</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={cn("relative", className)}>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Eye className="h-5 w-5" />
							Podgląd eksportu
						</CardTitle>
						<CardDescription>
							{previewData.length} z {data.length} rekordów • Format:{" "}
							{configuration.format.toUpperCase()}
						</CardDescription>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="outline">{availableColumns.length} kolumn</Badge>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsFullscreen(!isFullscreen)}
						>
							{isFullscreen ? (
								<Minimize2 className="h-4 w-4" />
							) : (
								<Maximize2 className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Column visibility controls */}
				<div className="space-y-2">
					<div className="font-medium text-sm">Widoczność kolumn:</div>
					<div className="flex flex-wrap gap-2">
						{availableColumns.map((column) => (
							<Button
								key={column.key}
								variant={
									hiddenColumns.has(column.key) ? "secondary" : "outline"
								}
								size="sm"
								onClick={() => toggleColumnVisibility(column.key)}
								className="text-xs"
							>
								{hiddenColumns.has(column.key) ? (
									<EyeOff className="mr-1 h-3 w-3" />
								) : (
									<Eye className="mr-1 h-3 w-3" />
								)}
								{column.polishLabel || column.label}
							</Button>
						))}
					</div>
				</div>

				<Separator />

				{/* Preview content */}
				<ScrollArea className={cn("h-96", isFullscreen && "h-[70vh]")}>
					{renderFormatPreview()}
				</ScrollArea>

				{/* Preview info */}
				<div className="flex items-center justify-between border-t pt-2 text-muted-foreground text-sm">
					<div className="flex items-center gap-4">
						<span>
							Pokazano maksymalnie {maxPreviewRows} pierwszych rekordów
						</span>
						{data.length > maxPreviewRows && (
							<Badge variant="secondary">
								+{data.length - maxPreviewRows} pozostałych rekordów
							</Badge>
						)}
					</div>
					<div className="flex items-center gap-2">
						<span>Format: {configuration.format.toUpperCase()}</span>
						<span>•</span>
						<span>
							Plik: {configuration.filename}.{configuration.format}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ExportPreview;
