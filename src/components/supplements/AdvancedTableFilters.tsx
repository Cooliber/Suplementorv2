/**
 * Advanced Table Filters Component
 * Provides comprehensive filtering and sorting capabilities
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Filter,
  Search,
  X,
  Save,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Plus,
  Minus,
  Calendar,
  TrendingUp,
  TrendingDown,
  Star,
} from "lucide-react";

import type { FilterConfig, SortConfig } from "./types";
import type { SupplementCategory, EvidenceLevel } from "@/types/supplement";

interface AdvancedTableFiltersProps {
  filterConfig: FilterConfig;
  sortConfig: SortConfig | null;
  onFilterChange: (config: FilterConfig) => void;
  onSortChange: (config: SortConfig | null) => void;
  className?: string;
}

// Filter preset interface
interface FilterPreset {
  id: string;
  name: string;
  description: string;
  config: FilterConfig;
  sortConfig: SortConfig | null;
  isDefault?: boolean;
}

// Predefined filter presets
const FILTER_PRESETS: FilterPreset[] = [
  {
    id: "all",
    name: "Wszystkie suplementy",
    description: "Pokaż wszystkie dostępne suplementy",
    config: {},
    sortConfig: null,
    isDefault: true,
  },
  {
    id: "strong-evidence",
    name: "Silne dowody",
    description: "Tylko suplementy z silnymi dowodami naukowymi",
    config: { evidenceLevel: ["STRONG"] },
    sortConfig: { key: "evidenceLevel", direction: "desc" },
  },
  {
    id: "vitamins-minerals",
    name: "Witaminy i minerały",
    description: "Podstawowe witaminy i minerały",
    config: { category: ["VITAMIN", "MINERAL"] },
    sortConfig: { key: "name", direction: "asc" },
  },
  {
    id: "nootropics",
    name: "Nootropiki",
    description: "Suplementy poprawiające funkcje poznawcze",
    config: { category: ["NOOTROPIC"] },
    sortConfig: { key: "evidenceLevel", direction: "desc" },
  },
  {
    id: "safe-profile",
    name: "Bezpieczny profil",
    description: "Suplementy z minimalnymi efektami ubocznymi",
    config: {},
    sortConfig: { key: "sideEffects", direction: "asc" },
  },
  {
    id: "research-focused",
    name: "Bogate w badania",
    description: "Suplementy z licznymi badaniami naukowymi",
    config: {},
    sortConfig: { key: "researchCount", direction: "desc" },
  },
];

export function AdvancedTableFilters({
  filterConfig,
  sortConfig,
  onFilterChange,
  onSortChange,
  className = "",
}: AdvancedTableFiltersProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [savedPresets, setSavedPresets] = useState<FilterPreset[]>(FILTER_PRESETS);
  const [newPresetName, setNewPresetName] = useState("");

  // Handle search query change
  const handleSearchChange = (value: string) => {
    onFilterChange({
      ...filterConfig,
      searchQuery: value || undefined,
    });
  };

  // Handle category filter change
  const handleCategoryChange = (categories: string[]) => {
    onFilterChange({
      ...filterConfig,
      category: categories.length > 0 ? categories as SupplementCategory[] : undefined,
    });
  };

  // Handle evidence level filter change
  const handleEvidenceLevelChange = (levels: string[]) => {
    onFilterChange({
      ...filterConfig,
      evidenceLevel: levels.length > 0 ? levels as EvidenceLevel[] : undefined,
    });
  };

  // Apply filter preset
  const applyPreset = (preset: FilterPreset) => {
    onFilterChange(preset.config);
    onSortChange(preset.sortConfig);
  };

  // Save current configuration as preset
  const saveCurrentAsPreset = () => {
    if (!newPresetName.trim()) return;

    const newPreset: FilterPreset = {
      id: `custom-${Date.now()}`,
      name: newPresetName.trim(),
      description: "Niestandardowy preset użytkownika",
      config: filterConfig,
      sortConfig,
    };

    setSavedPresets([...savedPresets, newPreset]);
    setNewPresetName("");
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFilterChange({});
    onSortChange(null);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filterConfig.searchQuery) count++;
    if (filterConfig.category?.length) count++;
    if (filterConfig.evidenceLevel?.length) count++;
    return count;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Zaawansowane filtry
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFilterCount()} aktywnych
              </Badge>
            )}
          </div>
          {getActiveFilterCount() > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Wyczyść
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Podstawowe</TabsTrigger>
            <TabsTrigger value="advanced">Zaawansowane</TabsTrigger>
            <TabsTrigger value="presets">Presety</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            {/* Search */}
            <div>
              <Label className="text-sm font-medium">Wyszukiwanie</Label>
              <div className="relative mt-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Szukaj po nazwie, kategorii..."
                  value={filterConfig.searchQuery || ""}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Separator />

            {/* Quick Category Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Kategoria</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "VITAMIN", label: "Witaminy" },
                  { value: "MINERAL", label: "Minerały" },
                  { value: "NOOTROPIC", label: "Nootropiki" },
                  { value: "HERB", label: "Zioła" },
                  { value: "ADAPTOGEN", label: "Adaptogeny" },
                  { value: "AMINO_ACID", label: "Aminokwasy" },
                ].map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.value}
                      checked={filterConfig.category?.includes(category.value as SupplementCategory) || false}
                      onCheckedChange={(checked) => {
                        const currentCategories = filterConfig.category || [];
                        if (checked) {
                          handleCategoryChange([...currentCategories, category.value]);
                        } else {
                          handleCategoryChange(currentCategories.filter(c => c !== category.value));
                        }
                      }}
                    />
                    <Label htmlFor={category.value} className="text-sm">
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Quick Evidence Level Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Poziom dowodów</Label>
              <div className="space-y-2">
                {[
                  { value: "STRONG", label: "Silne", color: "bg-green-100 text-green-800" },
                  { value: "MODERATE", label: "Umiarkowane", color: "bg-blue-100 text-blue-800" },
                  { value: "WEAK", label: "Słabe", color: "bg-yellow-100 text-yellow-800" },
                ].map((level) => (
                  <div key={level.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={level.value}
                      checked={filterConfig.evidenceLevel?.includes(level.value as EvidenceLevel) || false}
                      onCheckedChange={(checked) => {
                        const currentLevels = filterConfig.evidenceLevel || [];
                        if (checked) {
                          handleEvidenceLevelChange([...currentLevels, level.value]);
                        } else {
                          handleEvidenceLevelChange(currentLevels.filter(l => l !== level.value));
                        }
                      }}
                    />
                    <Label htmlFor={level.value} className="text-sm">
                      {level.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-6 pr-4">
                {/* Advanced Search Options */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Opcje wyszukiwania</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Wyszukiwanie dokładne</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Uwzględnij opis</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Uwzględnij nazwy łacińskie</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Research Count Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Minimalna liczba badań: {filterConfig.minResearchCount || 0}
                  </Label>
                  <Slider
                    value={[filterConfig.minResearchCount || 0]}
                    onValueChange={([value]) =>
                      onFilterChange({
                        ...filterConfig,
                        minResearchCount: value || undefined,
                      })
                    }
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>

                <Separator />

                {/* Side Effects Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Efekty uboczne</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Tylko bezpieczne suplementy</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Pokaż tylko z efektami ubocznymi</Label>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Interaction Safety */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Bezpieczeństwo interakcji</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Tylko suplementy bez poważnych interakcji</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Uwzględnij interakcje z lekami</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            {/* Save Current Preset */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Zapisz bieżący preset</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nazwa presetu..."
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                />
                <Button onClick={saveCurrentAsPreset} disabled={!newPresetName.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  Zapisz
                </Button>
              </div>
            </div>

            <Separator />

            {/* Available Presets */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Dostępne presety</Label>
              <ScrollArea className="h-[250px]">
                <div className="space-y-2">
                  {savedPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        JSON.stringify(filterConfig) === JSON.stringify(preset.config) &&
                        JSON.stringify(sortConfig) === JSON.stringify(preset.sortConfig)
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => applyPreset(preset)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{preset.name}</span>
                            {preset.isDefault && (
                              <Badge variant="outline" className="text-xs">Domyślny</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {preset.description}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Bookmark className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}