"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	AlertCircle,
	CheckCircle,
	Download,
	Eye,
	FileSpreadsheet,
	FileText,
	History,
	Save,
	Settings,
	Share2,
	Table,
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

export interface ExportDialogProps {
	data: ExportableData[];
	title?: string;
	description?: string;
	availableColumns?: Array<{
		key: string;
		label: string;
		polishLabel?: string;
		type?: string;
	}>;
	defaultConfiguration?: Partial<ExportConfiguration>;
	onExport?: (data: ExportableData[], config: ExportConfiguration) => void;
	onPreview?: (data: ExportableData[], config: ExportConfiguration) => void;
	onSaveConfiguration?: (config: ExportConfiguration) => void;
	savedConfigurations?: ExportConfiguration[];
	exportHistory?: Array<{
		id: string;
		timestamp: Date;
		config: ExportConfiguration;
		recordCount: number;
	}>;
	children?: React.ReactNode;
	className?: string;
}

const EXPORT_FORMATS = [
	{
		value: "csv" as const,
		label: "CSV",
		polishLabel: "CSV",
		description: "Plik wartości rozdzielanych przecinkami",
		icon: Table,
		recommended: true,
	},
	{
		value: "excel" as const,
		label: "Excel",
		polishLabel: "Excel",
		description: "Arkusz kalkulacyjny Microsoft Excel",
		icon: FileSpreadsheet,
	},
	{
		value: "json" as const,
		label: "JSON",
		polishLabel: "JSON",
		description: "JavaScript Object Notation",
		icon: FileText,
	},
	{
		value: "pdf" as const,
		label: "PDF",
		polishLabel: "PDF",
		description: "Portable Document Format",
		icon: FileText,
	},
];

export const ExportDialog: React.FC<ExportDialogProps> = ({
	data,
	title = "Eksport danych",
	description = "Wybierz format i opcje eksportu danych",
	availableColumns = [],
	defaultConfiguration = {},
	onExport,
	onPreview,
	onSaveConfiguration,
	savedConfigurations = [],
	exportHistory = [],
	children,
	className,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("format");
	const [configuration, setConfiguration] = useState<ExportConfiguration>({
		format: "csv",
		filename: `eksport-${new Date().toISOString().split("T")[0]}`,
		selectedColumns: availableColumns.map((col) => col.key),
		includeAllColumns: true,
		...defaultConfiguration,
	});

	const [isExporting, setIsExporting] = useState(false);
	const [exportProgress, setExportProgress] = useState(0);

	// Get available columns from data if not provided
	const detectedColumns = useMemo(() => {
		if (availableColumns.length > 0) return availableColumns;
		if (data.length === 0) return [];

		const firstRow = data[0];
		if (!firstRow) return [];

		return Object.keys(firstRow).map((key) => ({
			key,
			label: key,
			polishLabel: key,
			type: typeof firstRow[key],
		}));
	}, [data, availableColumns]);

	const handleFormatChange = (format: ExportConfiguration["format"]) => {
		setConfiguration((prev) => ({ ...prev, format }));
	};

	const handleColumnToggle = (columnKey: string, checked: boolean) => {
		setConfiguration((prev) => ({
			...prev,
			selectedColumns: checked
				? [...prev.selectedColumns, columnKey]
				: prev.selectedColumns.filter((key) => key !== columnKey),
			includeAllColumns: false,
		}));
	};

	const handleSelectAllColumns = (checked: boolean) => {
		setConfiguration((prev) => ({
			...prev,
			includeAllColumns: checked,
			selectedColumns: checked ? detectedColumns.map((col) => col.key) : [],
		}));
	};

	const handleFilenameChange = (filename: string) => {
		setConfiguration((prev) => ({ ...prev, filename }));
	};

	const handlePreview = () => {
		if (onPreview) {
			const previewData = data.slice(0, 5); // Show first 5 rows for preview
			onPreview(previewData, configuration);
		}
	};

	const handleExport = async () => {
		setIsExporting(true);
		setExportProgress(0);

		try {
			// Simulate progress for large exports
			const progressInterval = setInterval(() => {
				setExportProgress((prev) => {
					if (prev >= 90) {
						clearInterval(progressInterval);
						return prev;
					}
					return prev + 10;
				});
			}, 200);

			if (onExport) {
				await onExport(data, configuration);
			}

			clearInterval(progressInterval);
			setExportProgress(100);

			// Close dialog after successful export
			setTimeout(() => {
				setIsOpen(false);
				setIsExporting(false);
				setExportProgress(0);
			}, 1000);
		} catch (error) {
			console.error("Export failed:", error);
			setIsExporting(false);
			setExportProgress(0);
		}
	};

	const handleSaveConfiguration = () => {
		if (onSaveConfiguration) {
			onSaveConfiguration(configuration);
		}
	};

	const currentFormat = EXPORT_FORMATS.find(
		(f) => f.value === configuration.format,
	);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{children || (
					<Button variant="outline" className={className}>
						<Download className="mr-2 h-4 w-4" />
						Eksportuj
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Download className="h-5 w-5" />
						{title}
					</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="flex-1 overflow-hidden"
				>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="format">Format</TabsTrigger>
						<TabsTrigger value="columns">Kolumny</TabsTrigger>
						<TabsTrigger value="options">Opcje</TabsTrigger>
						<TabsTrigger value="history">Historia</TabsTrigger>
					</TabsList>

					<TabsContent value="format" className="mt-4 space-y-4">
						<div className="grid grid-cols-2 gap-4">
							{EXPORT_FORMATS.map((format) => {
								const Icon = format.icon;
								return (
									<div
										key={format.value}
										className={cn(
											"cursor-pointer rounded-lg border p-4 transition-colors",
											configuration.format === format.value
												? "border-primary bg-primary/5"
												: "border-border hover:bg-muted/50",
										)}
										onClick={() => handleFormatChange(format.value)}
									>
										<div className="flex items-center gap-3">
											<Icon className="h-8 w-8 text-primary" />
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<h3 className="font-medium">{format.polishLabel}</h3>
													{format.recommended && (
														<Badge variant="secondary" className="text-xs">
															Polecany
														</Badge>
													)}
												</div>
												<p className="text-muted-foreground text-sm">
													{format.description}
												</p>
											</div>
											{configuration.format === format.value && (
												<CheckCircle className="h-5 w-5 text-primary" />
											)}
										</div>
									</div>
								);
							})}
						</div>

						<div className="space-y-2">
							<Label htmlFor="filename">Nazwa pliku</Label>
							<Input
								id="filename"
								value={configuration.filename}
								onChange={(e) => handleFilenameChange(e.target.value)}
								placeholder="np. eksport-danych"
							/>
						</div>
					</TabsContent>

					<TabsContent value="columns" className="mt-4 space-y-4">
						<div className="flex items-center space-x-2">
							<Checkbox
								id="selectAll"
								checked={configuration.includeAllColumns}
								onCheckedChange={handleSelectAllColumns}
							/>
							<Label htmlFor="selectAll">Zaznacz wszystkie kolumny</Label>
						</div>

						<Separator />

						<ScrollArea className="h-64">
							<div className="space-y-3">
								{detectedColumns.map((column) => (
									<div key={column.key} className="flex items-center space-x-2">
										<Checkbox
											id={column.key}
											checked={
												configuration.includeAllColumns ||
												configuration.selectedColumns.includes(column.key)
											}
											disabled={configuration.includeAllColumns}
											onCheckedChange={(checked) =>
												handleColumnToggle(column.key, checked as boolean)
											}
										/>
										<Label htmlFor={column.key} className="flex-1">
											<div>
												<div className="font-medium">
													{column.polishLabel || column.label}
												</div>
												<div className="text-muted-foreground text-sm">
													{column.key}
												</div>
											</div>
										</Label>
										<Badge variant="outline" className="text-xs">
											{column.type}
										</Badge>
									</div>
								))}
							</div>
						</ScrollArea>

						<div className="text-muted-foreground text-sm">
							Wybrano {configuration.selectedColumns.length} z{" "}
							{detectedColumns.length} kolumn
						</div>
					</TabsContent>

					<TabsContent value="options" className="mt-4 space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Format daty</Label>
								<Select defaultValue="dd-mm-yyyy">
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
										<SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
										<SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Format liczb</Label>
								<Select defaultValue="default">
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="default">Domyślny</SelectItem>
										<SelectItem value="decimal">Dziesiętny</SelectItem>
										<SelectItem value="scientific">Naukowy</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex items-center space-x-2">
								<Checkbox id="includeHeaders" defaultChecked />
								<Label htmlFor="includeHeaders">Dołącz nagłówki kolumn</Label>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox id="includeMetadata" />
								<Label htmlFor="includeMetadata">
									Dołącz metadane eksportu
								</Label>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="history" className="mt-4 space-y-4">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<h3 className="font-medium">Ostatnie eksporty</h3>
								<Button variant="outline" size="sm">
									<History className="mr-2 h-4 w-4" />
									Wyczyść historię
								</Button>
							</div>

							<ScrollArea className="h-48">
								<div className="space-y-2">
									{exportHistory.length === 0 ? (
										<div className="py-8 text-center text-muted-foreground">
											Brak historii eksportów
										</div>
									) : (
										exportHistory.map((entry) => (
											<div
												key={entry.id}
												className="cursor-pointer rounded-lg border p-3 hover:bg-muted/50"
											>
												<div className="flex items-center justify-between">
													<div className="flex-1">
														<div className="font-medium">
															{entry.config.filename}.{entry.config.format}
														</div>
														<div className="text-muted-foreground text-sm">
															{entry.recordCount} rekordów •{" "}
															{entry.timestamp.toLocaleDateString("pl-PL")}
														</div>
													</div>
													<div className="flex items-center gap-2">
														<Badge variant="outline">
															{entry.config.format.toUpperCase()}
														</Badge>
														<Button variant="ghost" size="sm">
															<Share2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											</div>
										))
									)}
								</div>
							</ScrollArea>
						</div>

						{savedConfigurations.length > 0 && (
							<div className="space-y-3">
								<h3 className="font-medium">Zapisane konfiguracje</h3>
								<div className="grid gap-2">
									{savedConfigurations.map((config, index) => (
										<div
											key={index}
											className="cursor-pointer rounded border p-2 hover:bg-muted/50"
											onClick={() => setConfiguration(config)}
										>
											<div className="flex items-center justify-between">
												<span className="font-medium">{config.filename}</span>
												<Badge variant="secondary">
													{config.format.toUpperCase()}
												</Badge>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</TabsContent>
				</Tabs>

				{isExporting && (
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<div className="font-medium text-sm">Eksportowanie...</div>
							<div className="text-muted-foreground text-sm">
								{exportProgress}%
							</div>
						</div>
						<div className="h-2 w-full rounded-full bg-secondary">
							<div
								className="h-2 rounded-full bg-primary transition-all duration-300"
								style={{ width: `${exportProgress}%` }}
							/>
						</div>
					</div>
				)}

				<DialogFooter className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							onClick={handlePreview}
							disabled={isExporting}
						>
							<Eye className="mr-2 h-4 w-4" />
							Podgląd
						</Button>
						<Button variant="outline" onClick={handleSaveConfiguration}>
							<Save className="mr-2 h-4 w-4" />
							Zapisz konfigurację
						</Button>
					</div>

					<div className="flex items-center gap-2">
						<Button variant="outline" onClick={() => setIsOpen(false)}>
							Anuluj
						</Button>
						<Button onClick={handleExport} disabled={isExporting}>
							{isExporting ? (
								<>
									<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
									Eksportowanie...
								</>
							) : (
								<>
									<Download className="mr-2 h-4 w-4" />
									Eksportuj {data.length} rekordów
								</>
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ExportDialog;
