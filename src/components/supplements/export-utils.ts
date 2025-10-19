/**
 * Export utilities for supplement table data
 */

import type { SupplementWithRelations } from "@/types/supplement";
import { formatSupplementForComparison } from "./table-config";
import type { ExportOptions } from "./types";

// Export data to different formats
export function exportSupplementData(
	supplements: SupplementWithRelations[],
	options: ExportOptions,
): void {
	const dataToExport = supplements.map(formatSupplementForComparison);

	switch (options.format) {
		case "csv":
			exportToCSV(dataToExport, options);
			break;
		case "excel":
			exportToExcel(dataToExport, options);
			break;
		case "pdf":
			exportToPDF(dataToExport, options);
			break;
		case "json":
			exportToJSON(dataToExport, options);
			break;
		default:
			throw new Error(`Unsupported export format: ${options.format}`);
	}
}

// Export to CSV format
function exportToCSV(data: any[], options: ExportOptions): void {
	const headers = options.includeAllColumns
		? Object.keys(data[0] || {})
		: options.selectedColumns || Object.keys(data[0] || {});

	const csvContent = [
		headers.join(","),
		...data.map((row) =>
			headers
				.map((header) => {
					const value = row[header];
					// Handle nested objects and arrays
					if (typeof value === "object" && value !== null) {
						return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
					}
					return `"${String(value || "").replace(/"/g, '""')}"`;
				})
				.join(","),
		),
	].join("\n");

	downloadFile(csvContent, options.filename || "supplements.csv", "text/csv");
}

// Export to JSON format
function exportToJSON(data: any[], options: ExportOptions): void {
	const jsonData = JSON.stringify(data, null, 2);
	downloadFile(
		jsonData,
		options.filename || "supplements.json",
		"application/json",
	);
}

// Export to Excel format (simplified - creates CSV that can be opened in Excel)
function exportToExcel(data: any[], options: ExportOptions): void {
	// For now, we'll create a CSV with Excel-friendly formatting
	// In a real implementation, you might use a library like xlsx or exceljs
	const headers = options.includeAllColumns
		? Object.keys(data[0] || {})
		: options.selectedColumns || Object.keys(data[0] || {});

	const csvContent = [
		headers.join("\t"), // Use tabs for Excel compatibility
		...data.map((row) =>
			headers
				.map((header) => {
					const value = row[header];
					if (typeof value === "object" && value !== null) {
						return JSON.stringify(value);
					}
					return String(value || "");
				})
				.join("\t"),
		),
	].join("\n");

	downloadFile(
		csvContent,
		options.filename || "supplements.tsv",
		"text/tab-separated-values",
	);
}

// Export to PDF format (simplified - creates HTML that can be printed to PDF)
function exportToPDF(data: any[], options: ExportOptions): void {
	const headers = options.includeAllColumns
		? Object.keys(data[0] || {})
		: options.selectedColumns || Object.keys(data[0] || {});

	const htmlContent = generatePDFHTML(data, headers, options);

	// Create a new window with the content for printing
	const printWindow = window.open("", "_blank");
	if (printWindow) {
		printWindow.document.write(htmlContent);
		printWindow.document.close();
		printWindow.print();
	}
}

// Generate HTML content for PDF export
function generatePDFHTML(
	data: any[],
	headers: string[],
	options: ExportOptions,
): string {
	const currentDate = new Date().toLocaleDateString("pl-PL");

	return `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Porównanie suplementów - ${currentDate}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          color: #1f2937;
        }
        .header .subtitle {
          color: #6b7280;
          margin: 5px 0 0 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #e5e7eb;
          padding: 12px;
          text-align: left;
          vertical-align: top;
        }
        th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .supplement-name {
          font-weight: 600;
          color: #1f2937;
        }
        .category-badge {
          display: inline-block;
          padding: 2px 8px;
          background-color: #e0e7ff;
          color: #3730a3;
          border-radius: 12px;
          font-size: 12px;
          margin: 2px 0;
        }
        .evidence-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          margin: 2px 0;
        }
        .evidence-STRONG { background-color: #dcfce7; color: #166534; }
        .evidence-MODERATE { background-color: #dbeafe; color: #1e40af; }
        .evidence-WEAK { background-color: #fef3c7; color: #92400e; }
        .evidence-INSUFFICIENT { background-color: #f3f4f6; color: #374151; }
        .evidence-CONFLICTING { background-color: #fee2e2; color: #dc2626; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Porównanie suplementów</h1>
        <p class="subtitle">Wygenerowano ${currentDate}</p>
      </div>

      <table>
        <thead>
          <tr>
            ${headers.map((header) => `<th>${formatHeaderName(header)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data
						.map(
							(row) => `
            <tr>
              ${headers
								.map((header) => {
									const value = row[header];
									return `<td>${formatCellValue(header, value)}</td>`;
								})
								.join("")}
            </tr>
          `,
						)
						.join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;
}

// Helper function to format header names
function formatHeaderName(header: string): string {
	const headerMap: Record<string, string> = {
		name: "Nazwa",
		polishName: "Nazwa polska",
		category: "Kategoria",
		evidenceLevel: "Poziom dowodów",
		dosage: "Dawkowanie",
		clinicalApplications: "Zastosowania",
		sideEffects: "Efekty uboczne",
		interactions: "Interakcje",
		researchCount: "Liczba badań",
	};

	return headerMap[header] || header;
}

// Helper function to format cell values
function formatCellValue(header: string, value: any): string {
	if (value === null || value === undefined) {
		return "-";
	}

	switch (header) {
		case "category":
			return `<span class="category-badge">${value}</span>`;
		case "evidenceLevel":
			return `<span class="evidence-badge evidence-${value}">${value}</span>`;
		case "clinicalApplications":
			if (Array.isArray(value) && value.length > 0) {
				return value
					.slice(0, 2)
					.map((app: any) => `${app.condition} (${app.polishCondition})`)
					.join(", ");
			}
			return "-";
		case "sideEffects":
			if (Array.isArray(value) && value.length > 0) {
				const commonEffects = value.filter(
					(se: any) => se.frequency === "common",
				);
				return commonEffects
					.slice(0, 2)
					.map((se: any) => se.effect)
					.join(", ");
			}
			return "Minimalne";
		case "interactions":
			if (Array.isArray(value) && value.length > 0) {
				const severe = value.filter((i: any) => i.severity === "severe").length;
				const moderate = value.filter(
					(i: any) => i.severity === "moderate",
				).length;
				let result = "";
				if (severe > 0) result += `${severe} poważne`;
				if (moderate > 0)
					result += `${result ? ", " : ""}${moderate} umiarkowane`;
				return result || "Bezpieczny";
			}
			return "Bezpieczny";
		case "researchCount":
			return String(value);
		default:
			if (typeof value === "object") {
				return JSON.stringify(value);
			}
			return String(value);
	}
}

// Helper function to download file
function downloadFile(
	content: string,
	filename: string,
	mimeType: string,
): void {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

// Get available export formats
export function getAvailableExportFormats(): Array<{
	value: ExportOptions["format"];
	label: string;
	description: string;
}> {
	return [
		{
			value: "csv",
			label: "CSV",
			description:
				"Plik wartości rozdzielanych przecinkami, kompatybilny z Excel",
		},
		{
			value: "excel",
			label: "Excel (TSV)",
			description: "Format kompatybilny z Microsoft Excel",
		},
		{
			value: "json",
			label: "JSON",
			description: "JavaScript Object Notation, idealny dla programistów",
		},
		{
			value: "pdf",
			label: "PDF",
			description: "Portable Document Format, do drukowania i udostępniania",
		},
	];
}

// Validate export options
export function validateExportOptions(options: ExportOptions): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (!options.format) {
		errors.push("Format eksportu jest wymagany");
	}

	if (options.format === "csv" || options.format === "excel") {
		if (
			!options.includeAllColumns &&
			(!options.selectedColumns || options.selectedColumns.length === 0)
		) {
			errors.push(
				"Wybierz kolumny do eksportu lub zaznacz 'Uwzględnij wszystkie kolumny'",
			);
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
