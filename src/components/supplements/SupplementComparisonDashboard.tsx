/**
 * Main Supplement Comparison Dashboard
 * Combines table view and comparison view with responsive layout
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Grid, List, Maximize2, Minimize2 } from "lucide-react";

import { SupplementComparisonTable } from "./SupplementComparisonTable";
import { ComparisonView } from "./ComparisonView";
import type { SupplementWithRelations } from "@/types/supplement";

interface SupplementComparisonDashboardProps {
  supplements?: SupplementWithRelations[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onExport?: (data: any[], format: string) => void;
  className?: string;
  defaultView?: "table" | "split" | "comparison";
}

export function SupplementComparisonDashboard({
  supplements = [],
  onSelectionChange,
  onExport,
  className = "",
  defaultView = "table",
}: SupplementComparisonDashboardProps) {
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "split" | "comparison">(defaultView);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle selection changes from table
  const handleSelectionChange = (newSelectedIds: string[]) => {
    setSelectedSupplements(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  // Get selected supplement objects
  const selectedSupplementObjects = supplements.filter(s =>
    selectedSupplements.includes(s.id)
  );

  // Handle supplement removal from comparison
  const handleRemoveSupplement = (id: string) => {
    const newSelection = selectedSupplements.filter(sid => sid !== id);
    setSelectedSupplements(newSelection);
    onSelectionChange?.(newSelection);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Porównanie suplementów</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedSupplements.length} wybranych
            </Badge>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ComparisonView
            selectedSupplements={selectedSupplementObjects}
            onRemove={handleRemoveSupplement}
            className="h-full border-0 rounded-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Porównanie suplementów</h2>
              <p className="text-muted-foreground">
                Porównaj suplementy, analizuj interakcje i znajdź najlepsze rozwiązania
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-8"
                >
                  <List className="h-4 w-4 mr-1" />
                  Tabela
                </Button>
                <Button
                  variant={viewMode === "split" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("split")}
                  className="h-8"
                >
                  <Grid className="h-4 w-4 mr-1" />
                  Podzielony
                </Button>
                <Button
                  variant={viewMode === "comparison" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("comparison")}
                  className="h-8"
                >
                  Porównanie
                </Button>
              </div>

              {/* Fullscreen Toggle */}
              {selectedSupplements.length > 0 && (
                <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Selection Summary */}
          {selectedSupplements.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Wybrane suplementy:</span>
                {selectedSupplementObjects.map((supplement) => (
                  <Badge
                    key={supplement.id}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveSupplement(supplement.id)}
                  >
                    {supplement.name}
                    <span className="ml-1 text-xs">×</span>
                  </Badge>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      {viewMode === "table" && (
        <SupplementComparisonTable
          supplements={supplements}
          onSelectionChange={handleSelectionChange}
          onExport={onExport}
          maxSelection={5}
        />
      )}

      {viewMode === "comparison" && (
        <ComparisonView
          selectedSupplements={selectedSupplementObjects}
          onRemove={handleRemoveSupplement}
        />
      )}

      {viewMode === "split" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Tabela suplementów</h3>
                <SupplementComparisonTable
                  supplements={supplements}
                  onSelectionChange={handleSelectionChange}
                  onExport={onExport}
                  maxSelection={5}
                  showCustomization={false}
                  showExport={false}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <ComparisonView
              selectedSupplements={selectedSupplementObjects}
              onRemove={handleRemoveSupplement}
            />
          </div>
        </div>
      )}
    </div>
  );
}