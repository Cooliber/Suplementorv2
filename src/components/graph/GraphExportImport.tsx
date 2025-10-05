"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertTriangle,
	CheckCircle,
	Database,
	Download,
	FileImage,
	FileJson,
	FileSpreadsheet,
	FileText,
	Image,
	Info,
	Loader2,
	Settings,
	Upload,
} from "lucide-react";
import type React from "react";
import { useCallback, useRef, useState } from "react";

import { GraphExportService } from "@/lib/services/graph-export-service";
import type {
	ExportOptions,
	ImportResult,
} from "@/lib/services/graph-export-service";
import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";

export interface GraphExportImportProps {
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	supplements?: SupplementWithRelations[];
	svgElement?: SVGElement;
	onImport?: (data: {
		nodes: KnowledgeNode[];
		relationships: KnowledgeRelationship[];
		supplements: SupplementWithRelations[];
	}) => void;
	onExport?: () => void;
	className?: string;
}

const GraphExportImport: React.FC<GraphExportImportProps> = ({
	nodes,
	relationships,
	supplements = [],
	svgElement,
	onImport,
	onExport,
	className = "",
}) => {
	const [isExporting, setIsExporting] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [exportProgress, setExportProgress] = useState(0);
	const [importResult, setImportResult] = useState<ImportResult | null>(null);
	const [exportOptions, setExportOptions] = useState<ExportOptions>({
		format: "json",
		includeMetadata: true,
		includeConfiguration: true,
		preservePolishChars: true,
		compression: "none",
		quality: "high",
	});

	const fileInputRef = useRef<HTMLInputElement>(null);
	const exportService = new GraphExportService();

	// Handle export format change
	const handleFormatChange = useCallback((format: string) => {
		setExportOptions((prev) => ({
			...prev,
			format: format as ExportOptions["format"],
		}));
	}, []);

	// Handle export option change
	const handleOptionChange = useCallback(
		(option: keyof ExportOptions, value: any) => {
			setExportOptions((prev) => ({
				...prev,
				[option]: value,
			}));
		},
		[],
	);

	// Export to JSON
	const handleExportJSON = useCallback(async () => {
		setIsExporting(true);
		setExportProgress(0);

		try {
			setExportProgress(25);
			const jsonData = await exportService.exportToJSON(
				nodes,
				relationships,
				supplements,
				exportOptions,
			);

			setExportProgress(75);
			const filename = `graf-wiedzy-${new Date().toISOString().split("T")[0]}.json`;
			exportService.downloadFile(jsonData, filename, "application/json");

			setExportProgress(100);
			setTimeout(() => setExportProgress(0), 1000);
		} catch (error) {
			console.error("Błąd eksportu JSON:", error);
			alert("Wystąpił błąd podczas eksportu do JSON");
		} finally {
			setIsExporting(false);
		}
	}, [nodes, relationships, supplements, exportOptions, exportService]);

	// Export to CSV
	const handleExportCSV = useCallback(async () => {
		setIsExporting(true);
		setExportProgress(0);

		try {
			setExportProgress(25);
			const csvData = await exportService.exportToCSV(
				nodes,
				relationships,
				exportOptions,
			);

			setExportProgress(50);
			const timestamp = new Date().toISOString().split("T")[0];

			// Download nodes CSV
			exportService.downloadFile(
				csvData.nodes,
				`graf-wezly-${timestamp}.csv`,
				"text/csv",
			);

			setExportProgress(75);
			// Download relationships CSV
			exportService.downloadFile(
				csvData.relationships,
				`graf-relacje-${timestamp}.csv`,
				"text/csv",
			);

			setExportProgress(100);
			setTimeout(() => setExportProgress(0), 1000);
		} catch (error) {
			console.error("Błąd eksportu CSV:", error);
			alert("Wystąpił błąd podczas eksportu do CSV");
		} finally {
			setIsExporting(false);
		}
	}, [nodes, relationships, exportOptions, exportService]);

	// Export to SVG
	const handleExportSVG = useCallback(async () => {
		if (!svgElement) {
			alert("Brak elementu SVG do eksportu");
			return;
		}

		setIsExporting(true);
		setExportProgress(0);

		try {
			setExportProgress(25);
			const svgData = await exportService.exportToSVG(
				svgElement,
				exportOptions,
			);

			setExportProgress(75);
			const filename = `graf-wiedzy-${new Date().toISOString().split("T")[0]}.svg`;
			exportService.downloadFile(svgData, filename, "image/svg+xml");

			setExportProgress(100);
			setTimeout(() => setExportProgress(0), 1000);
		} catch (error) {
			console.error("Błąd eksportu SVG:", error);
			alert("Wystąpił błąd podczas eksportu do SVG");
		} finally {
			setIsExporting(false);
		}
	}, [svgElement, exportOptions, exportService]);

	// Export to PNG
	const handleExportPNG = useCallback(async () => {
		if (!svgElement) {
			alert("Brak elementu SVG do eksportu");
			return;
		}

		setIsExporting(true);
		setExportProgress(0);

		try {
			setExportProgress(25);
			const pngBlob = await exportService.exportToPNG(
				svgElement,
				exportOptions,
			);

			setExportProgress(75);
			const filename = `graf-wiedzy-${new Date().toISOString().split("T")[0]}.png`;
			exportService.downloadFile(pngBlob, filename, "image/png");

			setExportProgress(100);
			setTimeout(() => setExportProgress(0), 1000);
		} catch (error) {
			console.error("Błąd eksportu PNG:", error);
			alert("Wystąpił błąd podczas eksportu do PNG");
		} finally {
			setIsExporting(false);
		}
	}, [svgElement, exportOptions, exportService]);

	// Handle file import
	const handleFileImport = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			setIsImporting(true);
			setImportResult(null);

			try {
				const fileContent = await file.text();
				let result: ImportResult;

				if (file.name.endsWith(".json")) {
					result = await exportService.importFromJSON(fileContent);
				} else if (file.name.endsWith(".csv")) {
					// For CSV, we need both files - this is simplified
					result = await exportService.importFromCSV(fileContent, "");
				} else {
					result = {
						success: false,
						errors: ["Nieobsługiwany format pliku"],
						warnings: [],
						polishTextIssues: [],
					};
				}

				setImportResult(result);

				if (result.success && result.data && onImport) {
					onImport({
						nodes: result.data.nodes,
						relationships: result.data.relationships,
						supplements: result.data.supplements,
					});
				}
			} catch (error) {
				setImportResult({
					success: false,
					errors: [
						`Błąd odczytu pliku: ${error instanceof Error ? error.message : "Nieznany błąd"}`,
					],
					warnings: [],
					polishTextIssues: [],
				});
			} finally {
				setIsImporting(false);
			}

			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		[exportService, onImport],
	);

	// Trigger file input
	const triggerFileInput = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Database className="h-5 w-5" />
					Eksport i Import Grafu
				</CardTitle>
			</CardHeader>

			<CardContent>
				<Tabs defaultValue="export" className="space-y-4">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="export" className="flex items-center gap-2">
							<Download className="h-4 w-4" />
							Eksport
						</TabsTrigger>
						<TabsTrigger value="import" className="flex items-center gap-2">
							<Upload className="h-4 w-4" />
							Import
						</TabsTrigger>
					</TabsList>

					{/* Export Tab */}
					<TabsContent value="export" className="space-y-4">
						{/* Export Options */}
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="format">Format eksportu</Label>
									<Select
										value={exportOptions.format}
										onValueChange={handleFormatChange}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="json">
												<div className="flex items-center gap-2">
													<FileJson className="h-4 w-4" />
													JSON (pełne dane)
												</div>
											</SelectItem>
											<SelectItem value="csv">
												<div className="flex items-center gap-2">
													<FileSpreadsheet className="h-4 w-4" />
													CSV (tabele)
												</div>
											</SelectItem>
											<SelectItem value="svg">
												<div className="flex items-center gap-2">
													<FileImage className="h-4 w-4" />
													SVG (wektor)
												</div>
											</SelectItem>
											<SelectItem value="png">
												<div className="flex items-center gap-2">
													<Image className="h-4 w-4" />
													PNG (obraz)
												</div>
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{(exportOptions.format === "svg" ||
									exportOptions.format === "png") && (
									<div>
										<Label htmlFor="quality">Jakość</Label>
										<Select
											value={exportOptions.quality}
											onValueChange={(value) =>
												handleOptionChange("quality", value)
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="low">Niska</SelectItem>
												<SelectItem value="medium">Średnia</SelectItem>
												<SelectItem value="high">Wysoka</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
							</div>

							{/* Advanced Options */}
							<div className="space-y-3">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="includeMetadata"
										checked={exportOptions.includeMetadata}
										onCheckedChange={(checked) =>
											handleOptionChange("includeMetadata", checked)
										}
									/>
									<Label htmlFor="includeMetadata">Dołącz metadane</Label>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox
										id="includeConfiguration"
										checked={exportOptions.includeConfiguration}
										onCheckedChange={(checked) =>
											handleOptionChange("includeConfiguration", checked)
										}
									/>
									<Label htmlFor="includeConfiguration">
										Dołącz konfigurację
									</Label>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox
										id="preservePolishChars"
										checked={exportOptions.preservePolishChars}
										onCheckedChange={(checked) =>
											handleOptionChange("preservePolishChars", checked)
										}
									/>
									<Label htmlFor="preservePolishChars">
										Zachowaj polskie znaki
									</Label>
								</div>
							</div>
						</div>

						<Separator />

						{/* Export Progress */}
						{isExporting && (
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Loader2 className="h-4 w-4 animate-spin" />
									<span className="text-sm">Eksportowanie...</span>
								</div>
								<Progress value={exportProgress} className="h-2" />
							</div>
						)}

						{/* Export Buttons */}
						<div className="grid grid-cols-2 gap-3">
							<Button
								onClick={handleExportJSON}
								disabled={isExporting || exportOptions.format !== "json"}
								className="flex items-center gap-2"
							>
								<FileText className="h-4 w-4" />
								Eksportuj JSON
							</Button>

							<Button
								onClick={handleExportCSV}
								disabled={isExporting || exportOptions.format !== "csv"}
								className="flex items-center gap-2"
							>
								<FileSpreadsheet className="h-4 w-4" />
								Eksportuj CSV
							</Button>

							<Button
								onClick={handleExportSVG}
								disabled={
									isExporting || exportOptions.format !== "svg" || !svgElement
								}
								className="flex items-center gap-2"
							>
								<FileImage className="h-4 w-4" />
								Eksportuj SVG
							</Button>

							<Button
								onClick={handleExportPNG}
								disabled={
									isExporting || exportOptions.format !== "png" || !svgElement
								}
								className="flex items-center gap-2"
							>
								<Image className="h-4 w-4" />
								Eksportuj PNG
							</Button>
						</div>

						{/* Export Info */}
						<Alert>
							<Info className="h-4 w-4" />
							<AlertDescription>
								<strong>Statystyki:</strong> {nodes.length} węzłów,{" "}
								{relationships.length} relacji, {supplements.length} suplementów
							</AlertDescription>
						</Alert>
					</TabsContent>

					{/* Import Tab */}
					<TabsContent value="import" className="space-y-4">
						{/* File Input */}
						<div className="space-y-4">
							<div>
								<Label htmlFor="file-import">Wybierz plik do importu</Label>
								<div className="mt-2 flex gap-2">
									<Input
										type="file"
										ref={fileInputRef}
										onChange={handleFileImport}
										accept=".json,.csv"
										className="hidden"
									/>
									<Button
										onClick={triggerFileInput}
										disabled={isImporting}
										className="flex items-center gap-2"
									>
										{isImporting ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Upload className="h-4 w-4" />
										)}
										Wybierz plik
									</Button>
								</div>
								<p className="mt-1 text-gray-600 text-sm">
									Obsługiwane formaty: JSON (.json), CSV (.csv)
								</p>
							</div>
						</div>

						{/* Import Result */}
						{importResult && (
							<div className="space-y-3">
								<Separator />

								{importResult.success ? (
									<Alert className="border-green-200 bg-green-50">
										<CheckCircle className="h-4 w-4 text-green-600" />
										<AlertDescription>
											<strong>Import zakończony sukcesem!</strong>
											{importResult.data && (
												<div className="mt-2 text-sm">
													Zaimportowano: {importResult.data.nodes.length}{" "}
													węzłów, {importResult.data.relationships.length}{" "}
													relacji
												</div>
											)}
										</AlertDescription>
									</Alert>
								) : (
									<Alert className="border-red-200 bg-red-50">
										<AlertTriangle className="h-4 w-4 text-red-600" />
										<AlertDescription>
											<strong>Błąd importu</strong>
											<ul className="mt-2 list-inside list-disc text-sm">
												{importResult.errors.map((error, index) => (
													<li key={index}>{error}</li>
												))}
											</ul>
										</AlertDescription>
									</Alert>
								)}

								{/* Warnings */}
								{importResult.warnings.length > 0 && (
									<Alert className="border-yellow-200 bg-yellow-50">
										<AlertTriangle className="h-4 w-4 text-yellow-600" />
										<AlertDescription>
											<strong>Ostrzeżenia:</strong>
											<ul className="mt-2 list-inside list-disc text-sm">
												{importResult.warnings.map((warning, index) => (
													<li key={index}>{warning}</li>
												))}
											</ul>
										</AlertDescription>
									</Alert>
								)}

								{/* Polish Text Issues */}
								{importResult.polishTextIssues.length > 0 && (
									<Alert className="border-blue-200 bg-blue-50">
										<Info className="h-4 w-4 text-blue-600" />
										<AlertDescription>
											<strong>Problemy z polskim tekstem:</strong>
											<ul className="mt-2 list-inside list-disc text-sm">
												{importResult.polishTextIssues
													.slice(0, 5)
													.map((issue, index) => (
														<li key={index}>{issue}</li>
													))}
												{importResult.polishTextIssues.length > 5 && (
													<li>
														...i {importResult.polishTextIssues.length - 5}{" "}
														więcej
													</li>
												)}
											</ul>
										</AlertDescription>
									</Alert>
								)}
							</div>
						)}

						{/* Import Instructions */}
						<Alert>
							<Info className="h-4 w-4" />
							<AlertDescription>
								<strong>Instrukcje importu:</strong>
								<ul className="mt-2 list-inside list-disc text-sm">
									<li>Pliki JSON: Pełny import danych grafu z metadanymi</li>
									<li>
										Pliki CSV: Import węzłów i relacji (wymagane dwa pliki)
									</li>
									<li>Polskie znaki: Automatycznie wykrywane i walidowane</li>
									<li>
										Kompatybilność: Sprawdzana wersja i integralność danych
									</li>
								</ul>
							</AlertDescription>
						</Alert>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};

export default GraphExportImport;
