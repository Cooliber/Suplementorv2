"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Trash2,
  Share2,
  FolderOpen,
  FileText,
  HardDrive,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExportFile {
  id: string;
  filename: string;
  format: string;
  size: number;
  createdAt: Date;
  status: "ready" | "processing" | "error";
  downloadUrl?: string;
  error?: string;
}

export interface ExportFileManagerProps {
  files: ExportFile[];
  maxFiles?: number;
  autoCleanupHours?: number;
  onDownload?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  onShare?: (fileId: string) => void;
  onCleanup?: () => void;
  className?: string;
}

export const ExportFileManager: React.FC<ExportFileManagerProps> = ({
  files,
  maxFiles = 50,
  autoCleanupHours = 24,
  onDownload,
  onDelete,
  onShare,
  onCleanup,
  className,
}) => {
  const [storageInfo, setStorageInfo] = useState<{
    used: number;
    available: number;
    percentage: number;
  } | null>(null);

  // Get storage information (mock implementation)
  useEffect(() => {
    const getStorageInfo = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          const used = estimate.usage || 0;
          const quota = estimate.quota || 0;
          const available = quota - used;
          const percentage = quota > 0 ? (used / quota) * 100 : 0;

          setStorageInfo({ used, available, percentage });
        } catch (error) {
          console.warn("Storage estimation not available:", error);
        }
      }
    };

    getStorageInfo();
  }, []);

  // Auto cleanup old files
  const handleAutoCleanup = useCallback(() => {
    const cutoffTime = new Date(Date.now() - autoCleanupHours * 60 * 60 * 1000);
    const oldFiles = files.filter(file => file.createdAt < cutoffTime);

    if (oldFiles.length > 0 && onCleanup) {
      onCleanup();
    }
  }, [files, autoCleanupHours, onCleanup]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Get status icon and color
  const getStatusInfo = (status: ExportFile["status"]) => {
    switch (status) {
      case "ready":
        return { icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-50" };
      case "processing":
        return { icon: Clock, color: "text-blue-500", bgColor: "bg-blue-50" };
      case "error":
        return { icon: XCircle, color: "text-red-500", bgColor: "bg-red-50" };
      default:
        return { icon: FileText, color: "text-gray-500", bgColor: "bg-gray-50" };
    }
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const readyFiles = files.filter(file => file.status === "ready");
  const processingFiles = files.filter(file => file.status === "processing");

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Zarządzanie plikami eksportu
        </CardTitle>
        <CardDescription>
          Zarządzaj pobranymi plikami i przestrzenią dyskową
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Storage overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{files.length}</div>
            <div className="text-sm text-muted-foreground">Pliki</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-green-600">{readyFiles.length}</div>
            <div className="text-sm text-muted-foreground">Gotowe</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{processingFiles.length}</div>
            <div className="text-sm text-muted-foreground">W trakcie</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{formatFileSize(totalSize)}</div>
            <div className="text-sm text-muted-foreground">Rozmiar</div>
          </div>
        </div>

        {/* Storage usage */}
        {storageInfo && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Przestrzeń dyskowa</span>
              <span>{formatFileSize(storageInfo.used)} / {formatFileSize(storageInfo.used + storageInfo.available)}</span>
            </div>
            <Progress value={storageInfo.percentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {storageInfo.percentage.toFixed(1)}% wykorzystane
            </div>
          </div>
        )}

        <Separator />

        {/* Files list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Pliki eksportu</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleAutoCleanup}>
                <Trash2 className="mr-2 h-4 w-4" />
                Wyczyść stare
              </Button>
              {files.length > 0 && onCleanup && (
                <Button variant="outline" size="sm" onClick={onCleanup}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Wyczyść wszystko
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="h-64">
            <div className="space-y-2">
              {files.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Brak plików eksportu</p>
                </div>
              ) : (
                files.map((file) => {
                  const StatusIcon = getStatusInfo(file.status).icon;
                  const statusColor = getStatusInfo(file.status).color;
                  const statusBgColor = getStatusInfo(file.status).bgColor;

                  return (
                    <div
                      key={file.id}
                      className={cn(
                        "flex items-center justify-between p-3 border rounded-lg",
                        statusBgColor
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <StatusIcon className={cn("h-5 w-5", statusColor)} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{file.filename}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)} • {file.createdAt.toLocaleDateString("pl-PL")}
                          </div>
                          {file.error && (
                            <div className="text-sm text-red-600 flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              {file.error}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{file.format.toUpperCase()}</Badge>
                        <div className="flex gap-1">
                          {file.status === "ready" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDownload?.(file.id)}
                                title="Pobierz"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onShare?.(file.id)}
                                title="Udostępnij"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete?.(file.id)}
                            title="Usuń"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Storage warnings */}
        {files.length >= maxFiles * 0.8 && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Osiągnięto {Math.round((files.length / maxFiles) * 100)}% limitu plików
              </span>
            </div>
          </div>
        )}

        {storageInfo && storageInfo.percentage >= 80 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Niska ilość dostępnej przestrzeni dyskowej
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExportFileManager;