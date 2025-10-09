/**
 * Table Customization Panel
 * Provides comprehensive table customization options
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  Eye,
  EyeOff,
  Palette,
  Grid,
  List,
  RotateCcw,
  Save,
  Download,
} from "lucide-react";

import type { TableCustomizationPanelProps } from "./types";
import { DEFAULT_COLUMNS } from "./table-config";

export function TableCustomizationPanel({
  customization,
  availableColumns,
  onCustomizationChange,
  className = "",
}: TableCustomizationPanelProps) {
  const handleDensityChange = (value: string) => {
    onCustomizationChange({
      ...customization,
      density: value as "compact" | "normal" | "comfortable",
    });
  };

  const handleColumnToggle = (columnKey: string) => {
    const newVisibleColumns = customization.visibleColumns.includes(columnKey)
      ? customization.visibleColumns.filter(col => col !== columnKey)
      : [...customization.visibleColumns, columnKey];

    onCustomizationChange({
      ...customization,
      visibleColumns: newVisibleColumns,
    });
  };

  const handleShowBordersToggle = () => {
    onCustomizationChange({
      ...customization,
      showBorders: !customization.showBorders,
    });
  };

  const handleHighlightDifferencesToggle = () => {
    onCustomizationChange({
      ...customization,
      highlightDifferences: !customization.highlightDifferences,
    });
  };

  const resetToDefaults = () => {
    onCustomizationChange({
      visibleColumns: DEFAULT_COLUMNS.filter(col => col.key !== "visibility").map(col => col.key),
      density: "normal",
      showBorders: true,
      highlightDifferences: true,
    });
  };

  const saveCustomization = () => {
    // Save to localStorage or user preferences
    localStorage.setItem("supplement-table-customization", JSON.stringify(customization));
  };

  const loadCustomization = () => {
    try {
      const saved = localStorage.getItem("supplement-table-customization");
      if (saved) {
        const parsedCustomization = JSON.parse(saved);
        onCustomizationChange(parsedCustomization);
      }
    } catch (error) {
      console.error("Failed to load saved customization:", error);
    }
  };

  // Density options with Polish labels
  const densityOptions = [
    { value: "compact", label: "Kompaktowy", description: "Mały odstęp, więcej danych" },
    { value: "normal", label: "Normalny", description: "Standardowy odstęp" },
    { value: "comfortable", label: "Komfortowy", description: "Duży odstęp, łatwiejszy do czytania" },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Dostosuj tabelę
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-6">
            {/* Density Settings */}
            <div>
              <Label className="text-base font-medium mb-3 block">Gęstość tabeli</Label>
              <Select value={customization.density} onValueChange={handleDensityChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {densityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Column Visibility */}
            <div>
              <Label className="text-base font-medium mb-3 block">Widoczne kolumny</Label>
              <div className="space-y-2">
                {DEFAULT_COLUMNS.map((column) => (
                  <div key={column.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={customization.visibleColumns.includes(column.key)}
                        onCheckedChange={() => handleColumnToggle(column.key)}
                        disabled={column.key === "name"} // Name column should always be visible
                      />
                      <span className="text-sm">{column.polishLabel}</span>
                    </div>
                    {column.key === "name" && (
                      <Badge variant="outline" className="text-xs">Wymagane</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Display Options */}
            <div>
              <Label className="text-base font-medium mb-3 block">Opcje wyświetlania</Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Obramowania tabeli</Label>
                    <p className="text-xs text-muted-foreground">Pokaż linie siatki w tabeli</p>
                  </div>
                  <Switch
                    checked={customization.showBorders}
                    onCheckedChange={handleShowBordersToggle}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Podświetlanie różnic</Label>
                    <p className="text-xs text-muted-foreground">Wyróżnij różnice między suplementami</p>
                  </div>
                  <Switch
                    checked={customization.highlightDifferences}
                    onCheckedChange={handleHighlightDifferencesToggle}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Quick Presets */}
            <div>
              <Label className="text-base font-medium mb-3 block">Szybkie ustawienia</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDensityChange("compact")}
                  className="justify-start"
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Kompaktowy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDensityChange("comfortable")}
                  className="justify-start"
                >
                  <List className="h-4 w-4 mr-2" />
                  Komfortowy
                </Button>
              </div>
            </div>

            <Separator />

            {/* Column Statistics */}
            <div>
              <Label className="text-base font-medium mb-3 block">Statystyki kolumn</Label>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Dostępne kolumny:</span>
                  <Badge variant="outline">{DEFAULT_COLUMNS.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Widoczne kolumny:</span>
                  <Badge variant="outline">{customization.visibleColumns.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Ukryte kolumny:</span>
                  <Badge variant="outline">
                    {DEFAULT_COLUMNS.length - customization.visibleColumns.length}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={loadCustomization}>
                  <Download className="h-4 w-4 mr-2" />
                  Załaduj
                </Button>
                <Button variant="outline" size="sm" onClick={saveCustomization}>
                  <Save className="h-4 w-4 mr-2" />
                  Zapisz
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={resetToDefaults} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Przywróć domyślne
              </Button>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}