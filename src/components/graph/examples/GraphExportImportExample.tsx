/**
 * Graph Export/Import Examples
 * Demonstrates how to implement export and import functionality for graph data
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import {
	Download,
	FileJson,
	FolderOpen,
	Image,
	Save,
	Settings,
	Upload,
} from "lucide-react";
import { useRef, useState } from "react";

interface GraphExportImportExampleProps {
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	supplements: SupplementWithRelations[];
}

export const GraphExportImportExample: React.FC<
	GraphExportImportExampleProps
> = ({ nodes, relationships, supplements }) => {
	const [isExporting, setIsExporting] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [importFileName, setImportFileName] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Export graph data to JSON
	const handleExportJSON = () => {
		setIsExporting(true);

		try {
			const exportData = {
				nodes,
				relationships,
				supplements,
				metadata: {
					exportDate: new Date().toISOString(),
					nodeCount: nodes.length,
					relationshipCount: relationships.length,
					supplementCount: supplements.length,
					formatVersion: "1.0",
				},
			};

			const dataStr = JSON.stringify(exportData, null, 2);
			const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

			const exportFileDefaultName = `graph-data-export-${new Date().toISOString().split("T")[0]}.json`;

			const linkElement = document.createElement("a");
			linkElement.setAttribute("href", dataUri);
			linkElement.setAttribute("download", exportFileDefaultName);
			linkElement.click();

			toast({
				title: "Sukces",
				description:
					"Dane grafu zostały wyeksportowane pomyślnie do pliku JSON!",
			});
		} catch (error) {
			console.error("Export error:", error);
			toast({
				title: "Błąd",
				description: "Błąd podczas eksportu danych grafu do formatu JSON",
				variant: "destructive",
			});
		} finally {
			setIsExporting(false);
		}
	};

	// Export graph visualization to PNG
	const handleExportPNG = () => {
		setIsExporting(true);

		try {
			// In a real implementation, this would capture the canvas or SVG element
			// For this example, we'll simulate the process
			setTimeout(() => {
				toast({
					title: "Sukces",
					description:
						"Wizualizacja grafu została wyeksportowana pomyślnie do formatu PNG!",
				});
				setIsExporting(false);
			}, 1000);
		} catch (error) {
			console.error("PNG export error:", error);
			toast({
				title: "Błąd",
				description: "Błąd podczas eksportu wizualizacji grafu do formatu PNG",
				variant: "destructive",
			});
			setIsExporting(false);
		}
	};

	// Export graph visualization to SVG
	const handleExportSVG = () => {
		setIsExporting(true);

		try {
			// In a real implementation, this would serialize the SVG element
			// For this example, we'll simulate the process
			setTimeout(() => {
				toast({
					title: "Sukces",
					description:
						"Wizualizacja grafu została wyeksportowana pomyślnie do formatu SVG!",
				});
				setIsExporting(false);
			}, 1000);
		} catch (error) {
			console.error("SVG export error:", error);
			toast({
				title: "Błąd",
				description: "Błąd podczas eksportu wizualizacji grafu do formatu SVG",
				variant: "destructive",
			});
			setIsExporting(false);
		}
	};

	// Handle file import
	const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsImporting(true);
		setImportFileName(file.name);

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const importedData = JSON.parse(e.target?.result as string);

				// Validate the imported data structure
				if (
					!importedData.nodes ||
					!importedData.relationships ||
					!importedData.supplements
				) {
					throw new Error("Invalid graph data format");
				}

				// In a real implementation, you'd update the store with the imported data
				console.log("Imported graph data:", importedData);

				toast({
					title: "Sukces",
					description: `Dane grafu zostały zaimportowane pomyślnie z pliku ${file.name}!`,
				});

				// Reset the file input
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
				setImportFileName("");
			} catch (error) {
				console.error("Import error:", error);
				toast({
					title: "Błąd",
					description:
						"Błąd podczas importu danych grafu. Upewnij się, że plik ma poprawny format JSON.",
					variant: "destructive",
				});
				setImportFileName("");
			} finally {
				setIsImporting(false);
			}
		};
		reader.onerror = () => {
			toast({
				title: "Błąd",
				description: "Błąd podczas odczytu pliku",
				variant: "destructive",
			});
			setIsImporting(false);
			setImportFileName("");
		};
		reader.readAsText(file);
	};

	// Trigger file input click
	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Settings className="h-5 w-5" />
					Eksport/Import Grafu Wiedzy
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Export Section */}
				<div className="space-y-4">
					<h3 className="flex items-center gap-2 font-medium">
						<Save className="h-4 w-4" />
						Eksportuj dane grafu
					</h3>

					<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
						<Button
							variant="outline"
							onClick={handleExportJSON}
							disabled={isExporting}
							className="flex h-24 flex-col items-center justify-center gap-2"
						>
							<FileJson className="h-6 w-6" />
							<span>Eksport do JSON</span>
							{isExporting && (
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
							)}
						</Button>

						<Button
							variant="outline"
							onClick={handleExportPNG}
							disabled={isExporting}
							className="flex h-24 flex-col items-center justify-center gap-2"
						>
							<Image className="h-6 w-6" />
							<span>Eksport do PNG</span>
							{isExporting && (
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
							)}
						</Button>

						<Button
							variant="outline"
							onClick={handleExportSVG}
							disabled={isExporting}
							className="flex h-24 flex-col items-center justify-center gap-2"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<span>Eksport do SVG</span>
							{isExporting && (
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
							)}
						</Button>
					</div>
				</div>

				{/* Import Section */}
				<div className="space-y-4 border-t pt-4">
					<h3 className="flex items-center gap-2 font-medium">
						<FolderOpen className="h-4 w-4" />
						Importuj dane grafu
					</h3>

					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Input
								ref={fileInputRef}
								type="file"
								accept=".json"
								onChange={handleFileImport}
								className="hidden"
							/>

							<Button
								variant="outline"
								onClick={triggerFileInput}
								disabled={isImporting}
								className="flex items-center gap-2"
							>
								<Upload className="h-4 w-4" />
								Wybierz plik
							</Button>

							{importFileName && (
								<div className="flex-1 truncate text-gray-600 text-sm">
									{importFileName}
								</div>
							)}

							{isImporting && (
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
							)}
						</div>

						<div className="rounded-lg bg-gray-50 p-3 text-sm">
							<p className="mb-1 font-medium">Obsługiwane formaty:</p>
							<ul className="list-inside list-disc space-y-1 text-gray-600">
								<li>JSON (.json) - pełne dane grafu z węzłami i relacjami</li>
								<li>PNG (.png) - obraz wizualizacji grafu</li>
								<li>SVG (.svg) - skalowalna wizualizacja grafu</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Statistics */}
				<div className="grid grid-cols-3 gap-4 text-center">
					<div className="rounded-lg bg-blue-50 p-3">
						<div className="font-bold text-blue-600 text-xl">
							{nodes.length}
						</div>
						<div className="text-gray-600 text-xs">Węzły</div>
					</div>
					<div className="rounded-lg bg-green-50 p-3">
						<div className="font-bold text-green-600 text-xl">
							{relationships.length}
						</div>
						<div className="text-gray-600 text-xs">Połączenia</div>
					</div>
					<div className="rounded-lg bg-purple-50 p-3">
						<div className="font-bold text-purple-600 text-xl">
							{supplements.length}
						</div>
						<div className="text-gray-600 text-xs">Suplementy</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default GraphExportImportExample;
