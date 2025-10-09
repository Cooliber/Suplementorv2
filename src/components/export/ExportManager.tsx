"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ExportDialog, ExportConfiguration, ExportableData } from "./ExportDialog";
import { ExportPreview } from "./ExportPreview";
import { ExportFileManager, ExportFile } from "./ExportFileManager";
import { ExportTemplates, ExportTemplate } from "./ExportTemplates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  FileText,
  Database,
  BarChart3,
  Settings,
  History,
  Share2,
  Trash2,
  Edit,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExportHistoryEntry {
  id: string;
  timestamp: Date;
  configuration: ExportConfiguration;
  recordCount: number;
  fileSize?: number;
  status: "success" | "failed" | "pending";
}

export interface SavedConfiguration {
  id: string;
  name: string;
  configuration: ExportConfiguration;
  createdAt: Date;
  lastUsed?: Date;
  useCount: number;
}

export interface ExportManagerProps {
  data: ExportableData[];
  dataType: "supplements" | "analytics" | "visualization" | "generic";
  title?: string;
  description?: string;
  availableColumns?: Array<{
    key: string;
    label: string;
    polishLabel?: string;
    type?: string;
    category?: string;
  }>;
  defaultConfiguration?: Partial<ExportConfiguration>;
  onExport?: (data: ExportableData[], config: ExportConfiguration) => Promise<void>;
  onPreview?: (data: ExportableData[], config: ExportConfiguration) => void;
  className?: string;
}

export const ExportManager: React.FC<ExportManagerProps> = ({
  data,
  dataType,
  title,
  description,
  availableColumns = [],
  defaultConfiguration = {},
  onExport,
  onPreview,
  className,
}) => {
  const [exportHistory, setExportHistory] = useState<ExportHistoryEntry[]>([]);
  const [savedConfigurations, setSavedConfigurations] = useState<SavedConfiguration[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewConfig, setPreviewConfig] = useState<ExportConfiguration | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedFiles, setExportedFiles] = useState<ExportFile[]>([]);
  const [activeTab, setActiveTab] = useState<"main" | "templates" | "files">("main");

  // Generate default configuration based on data type
  const defaultConfig = useMemo((): ExportConfiguration => {
    const baseColumns = availableColumns.length > 0
      ? availableColumns.map(col => col.key)
      : data.length > 0 && data[0]
        ? Object.keys(data[0])
        : [];

    return {
      format: "csv",
      filename: `${dataType}-export-${new Date().toISOString().split('T')[0]}`,
      selectedColumns: baseColumns,
      includeAllColumns: true,
      ...defaultConfiguration,
    };
  }, [dataType, availableColumns, data, defaultConfiguration]);

  // Handle export with progress tracking
  const handleExport = useCallback(async (exportData: ExportableData[], config: ExportConfiguration) => {
    setIsExporting(true);

    const historyEntry: ExportHistoryEntry = {
      id: `export-${Date.now()}`,
      timestamp: new Date(),
      configuration: config,
      recordCount: exportData.length,
      status: "pending",
    };

    setExportHistory(prev => [historyEntry, ...prev]);

    try {
      if (onExport) {
        await onExport(exportData, config);
      } else {
        // Default export implementation with enhanced progress tracking
        await performDefaultExport(exportData, config, (progress, stage) => {
          // Update progress in real-time
          setExportHistory(prev =>
            prev.map(entry =>
              entry.id === historyEntry.id
                ? { ...entry, status: "pending" as const }
                : entry
            )
          );
        });
      }

      // Update history entry as successful
      setExportHistory(prev =>
        prev.map(entry =>
          entry.id === historyEntry.id
            ? { ...entry, status: "success" as const }
            : entry
        )
      );
    } catch (error) {
      console.error("Export failed:", error);

      // Update history entry as failed
      setExportHistory(prev =>
        prev.map(entry =>
          entry.id === historyEntry.id
            ? { ...entry, status: "failed" as const }
            : entry
        )
      );
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [onExport]);

  // Default export implementation
  const performDefaultExport = async (
    exportData: ExportableData[],
    config: ExportConfiguration,
    onProgress?: (progress: number, stage: string) => void
  ) => {
    const totalStages = 4; // prepare -> format -> finalize -> download
    let currentStage = 0;

    const updateProgress = (stage: string) => {
      currentStage++;
      const progress = Math.round((currentStage / totalStages) * 100);
      if (onProgress) {
        onProgress(progress, stage);
      }
    };

    // Simulate async export process with progress updates
    await new Promise(resolve => setTimeout(resolve, 500));
    updateProgress("Przygotowywanie danych");

    await new Promise(resolve => setTimeout(resolve, 500));
    updateProgress("Formatowanie danych");

    await new Promise(resolve => setTimeout(resolve, 300));
    updateProgress("Finalizowanie");

    // Use existing export utilities based on format
    switch (config.format) {
      case "csv":
        exportToCSV(exportData, config);
        break;
      case "json":
        exportToJSON(exportData, config);
        break;
      case "excel":
        exportToExcel(exportData, config);
        break;
      case "pdf":
        exportToPDF(exportData, config);
        break;
    }

    updateProgress("Pobieranie pliku");
  };

  // Export implementations
  const exportToCSV = (data: ExportableData[], config: ExportConfiguration) => {
    const headers = config.includeAllColumns
      ? Object.keys(data[0] || {})
      : config.selectedColumns || Object.keys(data[0] || {});

    const csvContent = [
      headers.join(","),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          if (typeof value === "object" && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          return `"${String(value || "").replace(/"/g, '""')}"`;
        }).join(",")
      )
    ].join("\n");

    downloadFile(csvContent, config.filename || "export.csv", "text/csv");
  };

  const exportToJSON = (data: ExportableData[], config: ExportConfiguration) => {
    const jsonData = JSON.stringify(data, null, 2);
    downloadFile(jsonData, config.filename || "export.json", "application/json");
  };

  const exportToExcel = (data: ExportableData[], config: ExportConfiguration) => {
    const headers = config.includeAllColumns
      ? Object.keys(data[0] || {})
      : config.selectedColumns || Object.keys(data[0] || {});

    const csvContent = [
      headers.join("\t"),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          if (typeof value === "object" && value !== null) {
            return JSON.stringify(value);
          }
          return String(value || "");
        }).join("\t")
      )
    ].join("\n");

    downloadFile(csvContent, config.filename || "export.tsv", "text/tab-separated-values");
  };

  const exportToPDF = (data: ExportableData[], config: ExportConfiguration) => {
    const headers = config.includeAllColumns
      ? Object.keys(data[0] || {})
      : config.selectedColumns || Object.keys(data[0] || {});

    const htmlContent = generatePDFHTML(data, headers, config);

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generatePDFHTML = (data: ExportableData[], headers: string[], config: ExportConfiguration) => {
    const currentDate = new Date().toLocaleDateString("pl-PL");

    return `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${config.filename} - ${currentDate}</title>
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
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title || "Eksport danych"}</h1>
          <p class="subtitle">Wygenerowano ${currentDate}</p>
        </div>

        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${headers.map(header => {
                  const value = row[header];
                  return `<td>${value !== null && value !== undefined ? String(value) : "-"}</td>`;
                }).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle preview
  const handlePreview = useCallback((previewData: ExportableData[], config: ExportConfiguration) => {
    setPreviewConfig(config);
    setShowPreview(true);
    if (onPreview) {
      onPreview(previewData, config);
    }
  }, [onPreview]);

  // Handle save configuration
  const handleSaveConfiguration = useCallback((config: ExportConfiguration) => {
    const savedConfig: SavedConfiguration = {
      id: `config-${Date.now()}`,
      name: `${config.filename} - ${config.format.toUpperCase()}`,
      configuration: config,
      createdAt: new Date(),
      useCount: 0,
    };

    setSavedConfigurations(prev => [savedConfig, ...prev]);
  }, []);

  // Handle delete configuration
  const handleDeleteConfiguration = useCallback((configId: string) => {
    setSavedConfigurations(prev => prev.filter(config => config.id !== configId));
  }, []);

  // Handle use configuration
  const handleUseConfiguration = useCallback((config: SavedConfiguration) => {
    setSavedConfigurations(prev =>
      prev.map(c =>
        c.id === config.id
          ? { ...c, lastUsed: new Date(), useCount: c.useCount + 1 }
          : c
      )
    );
    return config.configuration;
  }, []);

  // Handle export sharing
  const handleShareExport = useCallback(async (entry: ExportHistoryEntry) => {
    try {
      if (navigator.share && entry.status === "success") {
        // Use Web Share API if available
        await navigator.share({
          title: `Eksport danych - ${entry.configuration.filename}`,
          text: `Eksport ${entry.recordCount} rekordów w formacie ${entry.configuration.format.toUpperCase()}`,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        const shareText = `Eksport danych: ${entry.configuration.filename}.${entry.configuration.format}\n${entry.recordCount} rekordów • ${entry.timestamp.toLocaleDateString("pl-PL")}\nWygenerowano przez aplikację suplementów`;
        await navigator.clipboard.writeText(shareText);

        // Show toast notification (you might want to use your toast system)
        console.log("Link do eksportu został skopiowany do schowka");
      }
    } catch (error) {
      console.error("Sharing failed:", error);
    }
  }, []);

  // Handle export download (re-export)
  const handleDownloadExport = useCallback(async (entry: ExportHistoryEntry) => {
    try {
      const exportData = data; // In real implementation, you might want to store/cache the exported data
      await handleExport(exportData, entry.configuration);
    } catch (error) {
      console.error("Re-download failed:", error);
    }
  }, [data, handleExport]);

  // Handle delete export history entry
  const handleDeleteHistoryEntry = useCallback((entryId: string) => {
    setExportHistory(prev => prev.filter(entry => entry.id !== entryId));
  }, []);

  // Handle template selection
  const handleTemplateSelect = useCallback((template: ExportTemplate) => {
    const configWithTemplate: ExportConfiguration = {
      ...defaultConfig,
      ...template.configuration,
      selectedColumns: template.recommendedColumns || defaultConfig.selectedColumns,
      filename: template.configuration.filename || template.id,
    };

    // Open export dialog with template configuration
    setPreviewConfig(configWithTemplate);
    setShowPreview(true);
  }, [defaultConfig]);

  // Handle file operations
  const handleFileDownload = useCallback((fileId: string) => {
    const file = exportedFiles.find(f => f.id === fileId);
    if (file && file.downloadUrl) {
      const a = document.createElement("a");
      a.href = file.downloadUrl;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [exportedFiles]);

  const handleFileDelete = useCallback((fileId: string) => {
    setExportedFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const handleFileShare = useCallback(async (fileId: string) => {
    const file = exportedFiles.find(f => f.id === fileId);
    if (file) {
      try {
        if (navigator.share) {
          await navigator.share({
            title: `Plik eksportu - ${file.filename}`,
            text: `Plik eksportu w formacie ${file.format.toUpperCase()}`,
            url: file.downloadUrl || window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(file.downloadUrl || window.location.href);
        }
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    }
  }, [exportedFiles]);

  const handleCleanupFiles = useCallback(() => {
    setExportedFiles([]);
  }, []);

  // Update export success handler to add to files
  const originalHandleExport = handleExport;
  const handleExportWithFileTracking = useCallback(async (exportData: ExportableData[], config: ExportConfiguration) => {
    await originalHandleExport(exportData, config);

    // Add to exported files after successful export
    const newFile: ExportFile = {
      id: `file-${Date.now()}`,
      filename: `${config.filename}.${config.format}`,
      format: config.format,
      size: JSON.stringify(exportData).length * 2, // Rough estimate
      createdAt: new Date(),
      status: "ready",
      downloadUrl: "#", // In real implementation, this would be a blob URL or server URL
    };

    setExportedFiles(prev => [newFile, ...prev]);
  }, [originalHandleExport]);

  // Get data type icon and info
  const getDataTypeInfo = () => {
    switch (dataType) {
      case "supplements":
        return {
          icon: Database,
          label: "Suplementy",
          description: "Dane suplementów diety",
        };
      case "analytics":
        return {
          icon: BarChart3,
          label: "Analityka",
          description: "Dane analityczne i statystyki",
        };
      case "visualization":
        return {
          icon: FileText,
          label: "Wizualizacja",
          description: "Dane wizualizacji i wykresów",
        };
      default:
        return {
          icon: Database,
          label: "Dane",
          description: "Ogólne dane",
        };
    }
  };

  const dataTypeInfo = getDataTypeInfo();
  const DataIcon = dataTypeInfo.icon;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Export summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DataIcon className="h-5 w-5" />
            {title || `Eksport ${dataTypeInfo.label.toLowerCase()}`}
          </CardTitle>
          <CardDescription>
            {description || `${data.length} rekordów • ${dataTypeInfo.description}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {data.length} rekordów
              </Badge>
              <Badge variant="outline">
                {availableColumns.length || (data[0] ? Object.keys(data[0]).length : 0)} kolumn
              </Badge>
              <Badge variant="outline">
                Format: {defaultConfig.format.toUpperCase()}
              </Badge>
            </div>

            <ExportDialog
              data={data}
              title={title}
              description={description}
              availableColumns={availableColumns}
              defaultConfiguration={defaultConfig}
              onExport={handleExportWithFileTracking}
              onPreview={handlePreview}
              onSaveConfiguration={handleSaveConfiguration}
              savedConfigurations={savedConfigurations.map(config => config.configuration)}
              exportHistory={exportHistory.map(entry => ({
                id: entry.id,
                timestamp: entry.timestamp,
                config: entry.configuration,
                recordCount: entry.recordCount,
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview section */}
      {showPreview && previewConfig && (
        <ExportPreview
          data={data}
          configuration={previewConfig}
          maxPreviewRows={10}
        />
      )}

      {/* Export history */}
      {exportHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historia eksportów
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {exportHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {entry.configuration.filename}.{entry.configuration.format}
                        </span>
                        <Badge
                          variant={
                            entry.status === "success"
                              ? "default"
                              : entry.status === "failed"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {entry.status === "success"
                            ? "Sukces"
                            : entry.status === "failed"
                              ? "Błąd"
                              : "W trakcie"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.recordCount} rekordów • {entry.timestamp.toLocaleDateString("pl-PL")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShareExport(entry)}
                        title="Udostępnij eksport"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadExport(entry)}
                        title="Pobierz ponownie"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteHistoryEntry(entry.id)}
                        title="Usuń z historii"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Saved configurations */}
      {savedConfigurations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Zapisane konfiguracje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {savedConfigurations.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{config.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Utworzono: {config.createdAt.toLocaleDateString("pl-PL")}
                      {config.lastUsed && ` • Ostatnio użyte: ${config.lastUsed.toLocaleDateString("pl-PL")}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Użyć: {config.useCount}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteConfiguration(config.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export templates */}
      <ExportTemplates
        dataType={dataType}
        availableColumns={availableColumns}
        onSelectTemplate={handleTemplateSelect}
      />

      {/* File management */}
      <ExportFileManager
        files={exportedFiles}
        onDownload={handleFileDownload}
        onDelete={handleFileDelete}
        onShare={handleFileShare}
        onCleanup={handleCleanupFiles}
      />
    </div>
  );
};

export default ExportManager;