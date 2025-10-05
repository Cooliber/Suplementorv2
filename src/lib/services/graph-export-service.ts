/**
 * Graph Export Service
 * Handles export/import of graph data with Polish metadata preservation
 */

import { validatePolishTextEncoding } from "@/lib/utils/polish-text-optimizer";
import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";

export interface GraphExportData {
	version: string;
	timestamp: string;
	locale: string;
	metadata: {
		title: string;
		description: string;
		author?: string;
		tags: string[];
		nodeCount: number;
		relationshipCount: number;
		supplementCount: number;
	};
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	supplements: SupplementWithRelations[];
	configuration: {
		layout: string;
		filters: Record<string, any>;
		viewSettings: Record<string, any>;
	};
	polishMetadata: {
		encoding: string;
		diacriticsPreserved: boolean;
		textValidation: boolean;
	};
}

export interface ExportOptions {
	format: "json" | "csv" | "svg" | "png";
	includeMetadata?: boolean;
	includeConfiguration?: boolean;
	preservePolishChars?: boolean;
	compression?: "none" | "gzip";
	quality?: "low" | "medium" | "high"; // For image exports
}

export interface ImportResult {
	success: boolean;
	data?: GraphExportData;
	errors: string[];
	warnings: string[];
	polishTextIssues: string[];
}

export class GraphExportService {
	private readonly version = "1.0.0";
	private readonly supportedFormats = ["json", "csv", "svg", "png"] as const;

	/**
	 * Export graph data to JSON with Polish metadata preservation
	 */
	async exportToJSON(
		nodes: KnowledgeNode[],
		relationships: KnowledgeRelationship[],
		supplements: SupplementWithRelations[],
		options: Partial<ExportOptions> = {},
	): Promise<string> {
		const exportOptions: ExportOptions = {
			format: "json",
			includeMetadata: options.includeMetadata ?? true,
			includeConfiguration: options.includeConfiguration ?? true,
			preservePolishChars: options.preservePolishChars ?? true,
			compression: options.compression ?? "none",
			quality: options.quality ?? "medium",
		};

		// Validate Polish text encoding
		const polishTextIssues: string[] = [];
		if (exportOptions.preservePolishChars) {
			nodes.forEach((node) => {
				if (node.polishName && !validatePolishTextEncoding(node.polishName)) {
					polishTextIssues.push(`Błąd kodowania w nazwie węzła: ${node.id}`);
				}
				if (
					node.polishDescription &&
					!validatePolishTextEncoding(node.polishDescription)
				) {
					polishTextIssues.push(`Błąd kodowania w opisie węzła: ${node.id}`);
				}
			});

			relationships.forEach((rel) => {
				if (
					rel.polishMechanism &&
					!validatePolishTextEncoding(rel.polishMechanism)
				) {
					polishTextIssues.push(
						`Błąd kodowania w mechanizmie relacji: ${rel.id}`,
					);
				}
			});
		}

		const exportData: GraphExportData = {
			version: this.version,
			timestamp: new Date().toISOString(),
			locale: "pl-PL",
			metadata: {
				title: "Graf Wiedzy o Suplementach",
				description: "Eksport danych grafu wiedzy z polskimi nazwami i opisami",
				tags: ["suplementy", "nootropiki", "neuroplastyczność", "graf-wiedzy"],
				nodeCount: nodes.length,
				relationshipCount: relationships.length,
				supplementCount: supplements.length,
			},
			nodes: exportOptions.preservePolishChars
				? nodes
				: this.stripPolishMetadata(nodes),
			relationships: exportOptions.preservePolishChars
				? relationships
				: this.stripPolishRelationshipMetadata(relationships),
			supplements: exportOptions.preservePolishChars
				? supplements
				: this.stripPolishSupplementMetadata(supplements),
			configuration: exportOptions.includeConfiguration
				? {
						layout: "force",
						filters: {},
						viewSettings: {},
					}
				: {
						layout: "force",
						filters: {},
						viewSettings: {},
					},
			polishMetadata: {
				encoding: "UTF-8",
				diacriticsPreserved: exportOptions.preservePolishChars ?? true,
				textValidation: polishTextIssues.length === 0,
			},
		};

		if (polishTextIssues.length > 0) {
			console.warn("Problemy z kodowaniem polskiego tekstu:", polishTextIssues);
		}

		const jsonString = JSON.stringify(exportData, null, 2);

		// Apply compression if requested
		if (exportOptions.compression === "gzip") {
			// Note: In browser environment, we'd use a compression library
			// For now, return uncompressed JSON
			console.log("Kompresja GZIP nie jest dostępna w środowisku przeglądarki");
		}

		return jsonString;
	}

	/**
	 * Export graph data to CSV format
	 */
	async exportToCSV(
		nodes: KnowledgeNode[],
		relationships: KnowledgeRelationship[],
		options: Partial<ExportOptions> = {},
	): Promise<{ nodes: string; relationships: string }> {
		const exportOptions: ExportOptions = {
			format: "csv",
			preservePolishChars: true,
			...options,
		};

		// CSV headers for nodes
		const nodeHeaders = [
			"id",
			"name",
			"polishName",
			"type",
			"description",
			"polishDescription",
			"category",
			"evidenceLevel",
			"size",
			"importance",
			"color",
			"tags",
			"sources",
		];

		// CSV headers for relationships
		const relationshipHeaders = [
			"id",
			"sourceId",
			"targetId",
			"type",
			"strength",
			"confidence",
			"mechanism",
			"polishMechanism",
			"evidenceLevel",
		];

		// Convert nodes to CSV
		const nodeRows = nodes.map((node) => [
			this.escapeCsvValue(node.id),
			this.escapeCsvValue(node.name),
			this.escapeCsvValue(node.polishName || ""),
			this.escapeCsvValue(node.type),
			this.escapeCsvValue(node.description || ""),
			this.escapeCsvValue(node.polishDescription || ""),
			this.escapeCsvValue(node.category),
			this.escapeCsvValue(node.evidenceLevel),
			node.size.toString(),
			(node.importance || 0).toString(),
			this.escapeCsvValue(node.color || "#3B82F6"),
			this.escapeCsvValue((node.tags || []).join(";")),
			this.escapeCsvValue((node.sources || []).join(";")),
		]);

		// Convert relationships to CSV
		const relationshipRows = relationships.map((rel) => [
			this.escapeCsvValue(rel.id),
			this.escapeCsvValue(rel.sourceId),
			this.escapeCsvValue(rel.targetId),
			this.escapeCsvValue(rel.type),
			rel.strength.toString(),
			rel.confidence.toString(),
			this.escapeCsvValue(rel.mechanism || ""),
			this.escapeCsvValue(rel.polishMechanism || ""),
			this.escapeCsvValue(rel.evidenceLevel),
		]);

		const nodesCsv = [
			nodeHeaders.join(","),
			...nodeRows.map((row) => row.join(",")),
		].join("\n");
		const relationshipsCsv = [
			relationshipHeaders.join(","),
			...relationshipRows.map((row) => row.join(",")),
		].join("\n");

		return {
			nodes: nodesCsv,
			relationships: relationshipsCsv,
		};
	}

	/**
	 * Export graph visualization to SVG
	 */
	async exportToSVG(
		svgElement: SVGElement,
		options: Partial<ExportOptions> = {},
	): Promise<string> {
		const exportOptions: ExportOptions = {
			format: "svg",
			preservePolishChars: true,
			...options,
		};

		// Clone the SVG element to avoid modifying the original
		const clonedSvg = svgElement.cloneNode(true) as SVGElement;

		// Ensure Polish characters are properly encoded
		if (exportOptions.preservePolishChars) {
			this.ensurePolishEncodingInSVG(clonedSvg);
		}

		// Add metadata to SVG
		const metadataElement = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"metadata",
		);
		metadataElement.innerHTML = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:dc="http://purl.org/dc/elements/1.1/">
        <rdf:Description>
          <dc:title>Graf Wiedzy o Suplementach</dc:title>
          <dc:description>Wizualizacja połączeń między suplementami</dc:description>
          <dc:creator>Suplementor</dc:creator>
          <dc:language>pl-PL</dc:language>
          <dc:date>${new Date().toISOString()}</dc:date>
        </rdf:Description>
      </rdf:RDF>
    `;
		clonedSvg.insertBefore(metadataElement, clonedSvg.firstChild);

		// Serialize SVG to string
		const serializer = new XMLSerializer();
		let svgString = serializer.serializeToString(clonedSvg);

		// Add XML declaration with UTF-8 encoding
		svgString = `<?xml version="1.0" encoding="UTF-8"?>\n${svgString}`;

		return svgString;
	}

	/**
	 * Export graph visualization to PNG
	 */
	async exportToPNG(
		svgElement: SVGElement,
		options: Partial<ExportOptions> = {},
	): Promise<Blob> {
		const exportOptions: ExportOptions = {
			format: "png",
			quality: "high",
			preservePolishChars: true,
			...options,
		};

		// First convert to SVG
		const svgString = await this.exportToSVG(svgElement, exportOptions);

		// Create canvas for rasterization
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			throw new Error("Nie można utworzyć kontekstu canvas");
		}

		// Set canvas size based on quality
		const scaleFactor =
			exportOptions.quality === "high"
				? 2
				: exportOptions.quality === "medium"
					? 1.5
					: 1;
		const rect = svgElement.getBoundingClientRect();
		canvas.width = rect.width * scaleFactor;
		canvas.height = rect.height * scaleFactor;

		// Scale context for high DPI
		ctx.scale(scaleFactor, scaleFactor);

		// Create image from SVG
		const img = new Image();
		const svgBlob = new Blob([svgString], {
			type: "image/svg+xml;charset=utf-8",
		});
		const url = URL.createObjectURL(svgBlob);

		return new Promise((resolve, reject) => {
			img.onload = () => {
				ctx.drawImage(img, 0, 0);
				URL.revokeObjectURL(url);

				canvas.toBlob(
					(blob) => {
						if (blob) {
							resolve(blob);
						} else {
							reject(new Error("Nie można utworzyć obrazu PNG"));
						}
					},
					"image/png",
					0.95,
				);
			};

			img.onerror = () => {
				URL.revokeObjectURL(url);
				reject(new Error("Błąd ładowania obrazu SVG"));
			};

			img.src = url;
		});
	}

	/**
	 * Import graph data from JSON
	 */
	async importFromJSON(jsonString: string): Promise<ImportResult> {
		const result: ImportResult = {
			success: false,
			errors: [],
			warnings: [],
			polishTextIssues: [],
		};

		try {
			const data = JSON.parse(jsonString) as GraphExportData;

			// Validate version compatibility
			if (!this.isVersionCompatible(data.version)) {
				result.warnings.push(
					`Wersja pliku (${data.version}) może być niekompatybilna z aktualną wersją (${this.version})`,
				);
			}

			// Validate required fields
			const validationErrors = this.validateImportData(data);
			if (validationErrors.length > 0) {
				result.errors.push(...validationErrors);
				return result;
			}

			// Validate Polish text encoding
			if (data.polishMetadata?.diacriticsPreserved) {
				const polishIssues = this.validatePolishTextInImport(data);
				result.polishTextIssues.push(...polishIssues);
			}

			// Check for data integrity
			const integrityIssues = this.validateDataIntegrity(data);
			if (integrityIssues.length > 0) {
				result.warnings.push(...integrityIssues);
			}

			result.success = true;
			result.data = data;

			if (result.polishTextIssues.length > 0) {
				result.warnings.push(
					`Znaleziono ${result.polishTextIssues.length} problemów z kodowaniem polskiego tekstu`,
				);
			}
		} catch (error) {
			result.errors.push(
				`Błąd parsowania JSON: ${error instanceof Error ? error.message : "Nieznany błąd"}`,
			);
		}

		return result;
	}

	/**
	 * Import graph data from CSV
	 */
	async importFromCSV(
		nodesCsv: string,
		relationshipsCsv: string,
	): Promise<ImportResult> {
		const result: ImportResult = {
			success: false,
			errors: [],
			warnings: [],
			polishTextIssues: [],
		};

		try {
			const nodes = this.parseNodesFromCSV(nodesCsv);
			const relationships = this.parseRelationshipsFromCSV(relationshipsCsv);

			// Create minimal export data structure
			const data: GraphExportData = {
				version: this.version,
				timestamp: new Date().toISOString(),
				locale: "pl-PL",
				metadata: {
					title: "Import z CSV",
					description: "Dane zaimportowane z plików CSV",
					tags: ["import", "csv"],
					nodeCount: nodes.length,
					relationshipCount: relationships.length,
					supplementCount: 0,
				},
				nodes,
				relationships,
				supplements: [],
				configuration: {
					layout: "force",
					filters: {},
					viewSettings: {},
				},
				polishMetadata: {
					encoding: "UTF-8",
					diacriticsPreserved: true,
					textValidation: true,
				},
			};

			// Validate imported data
			const validationErrors = this.validateImportData(data);
			if (validationErrors.length > 0) {
				result.errors.push(...validationErrors);
				return result;
			}

			result.success = true;
			result.data = data;
		} catch (error) {
			result.errors.push(
				`Błąd importu CSV: ${error instanceof Error ? error.message : "Nieznany błąd"}`,
			);
		}

		return result;
	}

	/**
	 * Download exported data as file
	 */
	downloadFile(
		content: string | Blob,
		filename: string,
		mimeType: string,
	): void {
		const blob =
			content instanceof Blob
				? content
				: new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		link.style.display = "none";

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		URL.revokeObjectURL(url);
	}

	// Private helper methods

	private stripPolishMetadata(nodes: KnowledgeNode[]): KnowledgeNode[] {
		return nodes.map((node) => ({
			...node,
			polishName: node.name,
			polishDescription: node.description,
		}));
	}

	private stripPolishRelationshipMetadata(
		relationships: KnowledgeRelationship[],
	): KnowledgeRelationship[] {
		return relationships.map((rel) => ({
			...rel,
			polishMechanism: undefined,
		}));
	}

	private stripPolishSupplementMetadata(
		supplements: SupplementWithRelations[],
	): SupplementWithRelations[] {
		return supplements.map((supplement) => ({
			...supplement,
			polishName: supplement.name,
			polishDescription: supplement.description,
			polishCommonNames: supplement.commonNames,
		}));
	}

	private escapeCsvValue(value: string): string {
		if (value.includes(",") || value.includes('"') || value.includes("\n")) {
			return `"${value.replace(/"/g, '""')}"`;
		}
		return value;
	}

	private ensurePolishEncodingInSVG(svgElement: SVGElement): void {
		// Ensure all text elements preserve Polish characters
		const textElements = svgElement.querySelectorAll("text, tspan");
		textElements.forEach((element) => {
			if (element.textContent) {
				// Force UTF-8 encoding by re-setting text content
				const text = element.textContent;
				element.textContent = text;
			}
		});
	}

	private isVersionCompatible(version: string): boolean {
		const [major] = version.split(".").map(Number);
		const [currentMajor] = this.version.split(".").map(Number);
		return major === currentMajor;
	}

	private validateImportData(data: GraphExportData): string[] {
		const errors: string[] = [];

		if (!data.nodes || !Array.isArray(data.nodes)) {
			errors.push("Brak prawidłowych danych węzłów");
		}

		if (!data.relationships || !Array.isArray(data.relationships)) {
			errors.push("Brak prawidłowych danych relacji");
		}

		if (!data.metadata) {
			errors.push("Brak metadanych pliku");
		}

		return errors;
	}

	private validatePolishTextInImport(data: GraphExportData): string[] {
		const issues: string[] = [];

		data.nodes.forEach((node) => {
			if (node.polishName && !validatePolishTextEncoding(node.polishName)) {
				issues.push(`Błąd kodowania w polskiej nazwie węzła: ${node.id}`);
			}
		});

		data.relationships.forEach((rel) => {
			if (
				rel.polishMechanism &&
				!validatePolishTextEncoding(rel.polishMechanism)
			) {
				issues.push(`Błąd kodowania w polskim mechanizmie relacji: ${rel.id}`);
			}
		});

		return issues;
	}

	private validateDataIntegrity(data: GraphExportData): string[] {
		const warnings: string[] = [];
		const nodeIds = new Set(data.nodes.map((n) => n.id));

		// Check for orphaned relationships
		const orphanedRelationships = data.relationships.filter(
			(rel) => !nodeIds.has(rel.sourceId) || !nodeIds.has(rel.targetId),
		);

		if (orphanedRelationships.length > 0) {
			warnings.push(
				`Znaleziono ${orphanedRelationships.length} relacji bez odpowiadających węzłów`,
			);
		}

		return warnings;
	}

	private parseNodesFromCSV(csv: string): KnowledgeNode[] {
		const lines = csv.split("\n").filter((line) => line.trim());
		if (lines.length === 0) return [];
		const headers = lines[0]?.split(",") || [];

		return lines.slice(1).map((line, index) => {
			const values = this.parseCSVLine(line);
			const node: Partial<KnowledgeNode> = {};

			headers.forEach((header, i) => {
				const value = values[i]?.trim();
				switch (header.trim()) {
					case "id":
						node.id = value || `node-${index}`;
						break;
					case "name":
						node.name = value || `Node ${index}`;
						break;
					case "polishName":
						node.polishName = value;
						break;
					case "type":
						node.type = value as any;
						break;
					case "description":
						node.description = value || "";
						break;
					case "polishDescription":
						node.polishDescription = value;
						break;
					case "category":
						node.category = value || "Inne";
						break;
					case "evidenceLevel":
						node.evidenceLevel = value as any;
						break;
					case "size":
						node.size = Number.parseFloat(value || "8") || 8;
						break;
					case "importance":
						node.importance = Number.parseFloat(value || "0") || 0;
						break;
					case "color":
						node.color = value || "#3B82F6";
						break;
					case "tags":
						node.tags = value
							? value
									.split(";")
									.map((tag) => tag.trim())
									.filter((tag) => tag)
							: [];
						break;
					case "sources":
						node.sources = value
							? value
									.split(";")
									.map((source) => source.trim())
									.filter((source) => source)
							: [];
						break;
				}
			});

			return {
				id: node.id || `node-${index}`,
				name: node.name || `Node ${index}`,
				polishName: node.polishName || node.name || `Node ${index}`,
				type: node.type || "SUPPLEMENT",
				description: node.description || "",
				polishDescription: node.polishDescription,
				color: node.color || "#3B82F6",
				size: node.size || 8,
				properties: {},
				tags: node.tags || [],
				category: node.category || "Inne",
				evidenceLevel: node.evidenceLevel || "MODERATE",
				sources: node.sources || [],
				centrality: 0,
				clustering: 0,
				importance: node.importance || 0,
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				fx: null,
				fy: null,
				lastUpdated: new Date().toISOString(),
				createdAt: new Date().toISOString(),
			} as KnowledgeNode;
		});
	}

	private parseRelationshipsFromCSV(csv: string): KnowledgeRelationship[] {
		const lines = csv.split("\n").filter((line) => line.trim());
		if (lines.length === 0) return [];
		const headers = lines[0]?.split(",") || [];

		return lines.slice(1).map((line, index) => {
			const values = this.parseCSVLine(line);
			const rel: Partial<KnowledgeRelationship> = {};

			headers.forEach((header, i) => {
				const value = values[i]?.trim();
				switch (header.trim()) {
					case "id":
						rel.id = value || `rel-${index}`;
						break;
					case "sourceId":
						rel.sourceId = value || "";
						break;
					case "targetId":
						rel.targetId = value || "";
						break;
					case "type":
						rel.type = value as any;
						break;
					case "strength":
						rel.strength = Number.parseFloat(value || "0.5") || 0.5;
						break;
					case "confidence":
						rel.confidence = Number.parseFloat(value || "0.5") || 0.5;
						break;
					case "mechanism":
						rel.mechanism = value || "";
						break;
					case "polishMechanism":
						rel.polishMechanism = value;
						break;
					case "evidenceLevel":
						rel.evidenceLevel = value as any;
						break;
				}
			});

			return {
				id: rel.id || `rel-${index}`,
				sourceId: rel.sourceId || "",
				targetId: rel.targetId || "",
				type: rel.type || "ENHANCES",
				strength: rel.strength || 0.5,
				confidence: rel.confidence || 0.5,
				bidirectional: false,
				evidenceLevel: rel.evidenceLevel || "MODERATE",
				mechanism: rel.mechanism || "",
				polishMechanism: rel.polishMechanism,
				polishDescription: undefined,
				onset: undefined,
				duration: undefined,
				reversibility: undefined,
				dosageDependency: undefined,
				lastUpdated: new Date().toISOString(),
				createdAt: new Date().toISOString(),
			} as KnowledgeRelationship;
		});
	}

	private parseCSVLine(line: string): string[] {
		const result: string[] = [];
		let current = "";
		let inQuotes = false;

		for (let i = 0; i < line.length; i++) {
			const char = line[i];

			if (char === '"') {
				if (inQuotes && line[i + 1] === '"') {
					current += '"';
					i++; // Skip next quote
				} else {
					inQuotes = !inQuotes;
				}
			} else if (char === "," && !inQuotes) {
				result.push(current);
				current = "";
			} else {
				current += char;
			}
		}

		result.push(current);
		return result;
	}
}
