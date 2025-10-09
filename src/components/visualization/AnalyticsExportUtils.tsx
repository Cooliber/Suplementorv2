"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table } from "lucide-react";
import type React from "react";

interface ExportableData {
	[key: string]: any;
}

interface AnalyticsExportUtilsProps {
	data: ExportableData[];
	filename?: string;
	title?: string;
	onExport?: (format: "csv" | "pdf" | "json") => void;
}

const AnalyticsExportUtils: React.FC<AnalyticsExportUtilsProps> = ({
	data,
	filename = "analytics-export",
	title = "Eksport danych analitycznych",
	onExport,
}) => {
	// Convert data to CSV format
	const convertToCSV = (data: ExportableData[]): string => {
		if (data.length === 0) return "";

		const firstItem = data[0];
		if (!firstItem) return "";

		const headers = Object.keys(firstItem);
		const csvHeaders = headers.join(",");

		const csvRows = data.map(item =>
			headers.map(header => {
				const value = item[header];
				// Handle values that might contain commas or quotes
				if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
					return `"${value.replace(/"/g, '""')}"`;
				}
				return value;
			}).join(",")
		);

		return [csvHeaders, ...csvRows].join("\n");
	};

	// Convert data to JSON format
	const convertToJSON = (data: ExportableData[]): string => {
		return JSON.stringify(data, null, 2);
	};

	// Handle CSV export
	const handleCSVExport = () => {
		const csvContent = convertToCSV(data);
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");

		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", `${filename}.csv`);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}

		if (onExport) onExport("csv");
	};

	// Handle JSON export
	const handleJSONExport = () => {
		const jsonContent = convertToJSON(data);
		const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
		const link = document.createElement("a");

		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", `${filename}.json`);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}

		if (onExport) onExport("json");
	};

	// Handle PDF export (simplified - would need a PDF library for full implementation)
	const handlePDFExport = () => {
		// For now, we'll create a simple HTML-to-PDF export
		// In a real implementation, you might use libraries like jsPDF or Puppeteer
		const printWindow = window.open("", "_blank");
		if (printWindow) {
			printWindow.document.write(`
				<html>
					<head>
						<title>${title}</title>
						<style>
							body { font-family: Arial, sans-serif; margin: 20px; }
							table { border-collapse: collapse; width: 100%; }
							th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
							th { background-color: #f2f2f2; }
							h1 { color: #333; }
							.export-date { color: #666; font-size: 14px; }
						</style>
					</head>
					<body>
						<h1>${title}</h1>
						<p class="export-date">Wygenerowano: ${new Date().toLocaleDateString('pl-PL')}</p>
						<table>
							<thead>
								<tr>
									${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join("")}
								</tr>
							</thead>
							<tbody>
								${data.map(item => `
									<tr>
										${Object.values(item).map(value => `<td>${value}</td>`).join("")}
									</tr>
								`).join("")}
							</tbody>
						</table>
					</body>
				</html>
			`);
			printWindow.document.close();
			printWindow.print();
		}

		if (onExport) onExport("pdf");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					<Download className="mr-2 h-3 w-3" />
					Eksportuj
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={handleCSVExport}>
					<Table className="mr-2 h-3 w-3" />
					Eksportuj jako CSV
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleJSONExport}>
					<FileText className="mr-2 h-3 w-3" />
					Eksportuj jako JSON
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handlePDFExport}>
					<FileText className="mr-2 h-3 w-3" />
					Eksportuj jako PDF
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default AnalyticsExportUtils;