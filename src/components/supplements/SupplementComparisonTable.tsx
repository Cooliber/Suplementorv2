/**
 * Comprehensive Supplement Comparison Table
 * Features: sortable columns, multi-select, customization, export, responsive design
 */

"use client";

import React, { useReducer, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Settings,
  Download,
  Filter,
  Search,
  X,
  Grid,
  List,
  Eye,
  EyeOff,
} from "lucide-react";

import type {
  SupplementComparisonTableProps,
  TableState,
  TableAction,
  SortConfig,
  FilterConfig,
  TableCustomization,
  ComparisonSelection,
  ExportOptions,
} from "./types";
import { TableCustomizationPanel } from "./TableCustomizationPanel";
import { exportSupplementData, getAvailableExportFormats, validateExportOptions } from "./export-utils";
import { ResponsiveTableWrapper, ResponsiveTableControls } from "./ResponsiveTableWrapper";
import { AdvancedTableFilters } from "./AdvancedTableFilters";
import {
  DEFAULT_COLUMNS,
  getColumnByKey,
  getSortableColumns,
  getDefaultVisibleColumns,
  formatSupplementForComparison,
} from "./table-config";
import type { SupplementWithRelations, SupplementCategory, EvidenceLevel } from "@/types/supplement";

// Initial state
const initialState: TableState = {
  supplements: [],
  sortConfig: null,
  filterConfig: {},
  customization: {
    visibleColumns: getDefaultVisibleColumns(),
    density: "normal",
    showBorders: true,
    highlightDifferences: true,
  },
  selection: {
    selectedSupplements: [],
    comparisonMode: "multiple",
  },
  loading: false,
};

// Reducer function
function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case "SET_SUPPLEMENTS":
      return { ...state, supplements: action.payload };
    case "SET_SORT":
      return { ...state, sortConfig: action.payload };
    case "SET_FILTER":
      return { ...state, filterConfig: action.payload };
    case "SET_CUSTOMIZATION":
      return { ...state, customization: action.payload };
    case "SET_SELECTION":
      return { ...state, selection: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "TOGGLE_COLUMN":
      return {
        ...state,
        customization: {
          ...state.customization,
          visibleColumns: state.customization.visibleColumns.includes(action.payload)
            ? state.customization.visibleColumns.filter(col => col !== action.payload)
            : [...state.customization.visibleColumns, action.payload],
        },
      };
    case "TOGGLE_SUPPLEMENT":
      const isSelected = state.selection.selectedSupplements.includes(action.payload);
      return {
        ...state,
        selection: {
          ...state.selection,
          selectedSupplements: isSelected
            ? state.selection.selectedSupplements.filter(id => id !== action.payload)
            : [...state.selection.selectedSupplements, action.payload],
        },
      };
    case "CLEAR_SELECTION":
      return {
        ...state,
        selection: {
          ...state.selection,
          selectedSupplements: [],
        },
      };
    case "RESET_TABLE":
      return initialState;
    default:
      return state;
  }
}

// Main component
export function SupplementComparisonTable({
  supplements: initialSupplements = [],
  initialColumns = getDefaultVisibleColumns(),
  onSelectionChange,
  onExport,
  className = "",
  showCustomization = true,
  showExport = true,
  maxSelection = 5,
  responsive = true,
}: SupplementComparisonTableProps & { responsive?: boolean }) {
  const [state, dispatch] = useReducer(tableReducer, {
    ...initialState,
    supplements: initialSupplements,
    customization: {
      ...initialState.customization,
      visibleColumns: initialColumns,
    },
  });

  // Customization panel state
  const [showCustomizationPanel, setShowCustomizationPanel] = React.useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

  // Get sorted and filtered supplements
  const sortedAndFilteredSupplements = useMemo(() => {
    let filtered = [...state.supplements];

    // Apply search filter
    if (state.filterConfig.searchQuery) {
      const query = state.filterConfig.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (supplement) =>
          supplement.name.toLowerCase().includes(query) ||
          supplement.polishName.toLowerCase().includes(query) ||
          supplement.description?.toLowerCase().includes(query) ||
          supplement.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (state.filterConfig.category && state.filterConfig.category.length > 0) {
      filtered = filtered.filter((supplement) =>
        state.filterConfig.category!.includes(supplement.category)
      );
    }

    // Apply evidence level filter
    if (state.filterConfig.evidenceLevel && state.filterConfig.evidenceLevel.length > 0) {
      filtered = filtered.filter((supplement) =>
        state.filterConfig.evidenceLevel!.includes(supplement.evidenceLevel)
      );
    }

    // Apply sorting
    if (state.sortConfig) {
      filtered.sort((a, b) => {
        const aValue = (a as any)[state.sortConfig!.key];
        const bValue = (b as any)[state.sortConfig!.key];

        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;

        return state.sortConfig!.direction === "desc" ? -comparison : comparison;
      });
    }

    return filtered;
  }, [state.supplements, state.sortConfig, state.filterConfig]);

  // Toggle sort function
  const toggleSort = useCallback((key: string) => {
    dispatch({
      type: "SET_SORT",
      payload:
        state.sortConfig?.key === key && state.sortConfig.direction === "asc"
          ? { key, direction: "desc" }
          : { key, direction: "asc" },
    });
  }, [state.sortConfig]);

  // Toggle column visibility
  const toggleColumn = useCallback((key: string) => {
    dispatch({ type: "TOGGLE_COLUMN", payload: key });
  }, []);

  // Toggle supplement selection
  const toggleSupplement = useCallback((id: string) => {
    if (state.selection.selectedSupplements.length >= maxSelection &&
        !state.selection.selectedSupplements.includes(id)) {
      return; // Don't allow more selections than max
    }
    dispatch({ type: "TOGGLE_SUPPLEMENT", payload: id });
    onSelectionChange?.(state.selection.selectedSupplements.includes(id)
      ? state.selection.selectedSupplements.filter(sid => sid !== id)
      : [...state.selection.selectedSupplements, id]
    );
  }, [state.selection.selectedSupplements, maxSelection, onSelectionChange]);

  // Clear selection
  const clearSelection = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTION" });
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  // Get active filter count
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (state.filterConfig.searchQuery) count++;
    if (state.filterConfig.category?.length) count++;
    if (state.filterConfig.evidenceLevel?.length) count++;
    if (state.filterConfig.minResearchCount) count++;
    return count;
  }, [state.filterConfig]);

  // Export data
  const exportData = useCallback((options: ExportOptions) => {
    // Validate options
    const validation = validateExportOptions(options);
    if (!validation.valid) {
      console.error("Export validation failed:", validation.errors);
      return;
    }

    try {
      exportSupplementData(sortedAndFilteredSupplements, options);
      onExport?.(sortedAndFilteredSupplements.map(formatSupplementForComparison), options.format);
    } catch (error) {
      console.error("Export failed:", error);
    }
  }, [sortedAndFilteredSupplements, onExport]);

  // Get visible columns
  const visibleColumns = DEFAULT_COLUMNS.filter(col =>
    state.customization.visibleColumns.includes(col.key)
  );

  // Get available columns for customization panel
  const availableColumns = DEFAULT_COLUMNS;

  // Density classes
  const densityClasses = {
    compact: "p-2 text-sm",
    normal: "p-4 text-sm",
    comfortable: "p-6 text-base",
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Porównanie suplementów</CardTitle>

            <div className="flex flex-wrap gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Szukaj suplementów..."
                  value={state.filterConfig.searchQuery || ""}
                  onChange={(e) =>
                    dispatch({ type: "SET_FILTER", payload: { ...state.filterConfig, searchQuery: e.target.value } })
                  }
                  className="pl-8 w-[200px]"
                />
              </div>

              {/* Filters */}
              <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtry
                    {getActiveFilterCount() > 0 && (
                      <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 text-xs">
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="start">
                  <div className="p-4">
                    <AdvancedTableFilters
                      filterConfig={state.filterConfig}
                      sortConfig={state.sortConfig}
                      onFilterChange={(config) => dispatch({ type: "SET_FILTER", payload: config })}
                      onSortChange={(config) => dispatch({ type: "SET_SORT", payload: config })}
                    />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Column Visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Kolumny
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {DEFAULT_COLUMNS.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.key}
                      checked={state.customization.visibleColumns.includes(column.key)}
                      onCheckedChange={() => toggleColumn(column.key)}
                    >
                      {column.polishLabel}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Customization Panel */}
              {showCustomization && (
                <Sheet open={showCustomizationPanel} onOpenChange={setShowCustomizationPanel}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Dostosuj
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Dostosuj tabelę</SheetTitle>
                      <SheetDescription>
                        Dostosuj wygląd i zachowanie tabeli porównawczej
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <TableCustomizationPanel
                        customization={state.customization}
                        availableColumns={availableColumns}
                        onCustomizationChange={(newCustomization) =>
                          dispatch({ type: "SET_CUSTOMIZATION", payload: newCustomization })
                        }
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              )}

              {/* Export */}
              {showExport && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Eksportuj
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => exportData({ format: "json", includeAllColumns: true })}>
                      Eksportuj jako JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportData({ format: "csv", includeAllColumns: true })}>
                      Eksportuj jako CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Clear Selection */}
              {state.selection.selectedSupplements.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  <X className="h-4 w-4 mr-2" />
                  Wyczyść wybór ({state.selection.selectedSupplements.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Selection Summary */}
      {state.selection.selectedSupplements.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Wybrane suplementy ({state.selection.selectedSupplements.length}/{maxSelection}):</span>
              {state.selection.selectedSupplements.map((id) => {
                const supplement = state.supplements.find(s => s.id === id);
                return supplement ? (
                  <Badge key={id} variant="secondary" className="cursor-pointer" onClick={() => toggleSupplement(id)}>
                    {supplement.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Responsive Table Display */}
      {responsive ? (
        <div className="space-y-4">
          <ResponsiveTableControls screenSize="desktop">
            {/* Table Controls */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <CardTitle>Porównanie suplementów</CardTitle>

                  <div className="flex flex-wrap gap-2">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Szukaj suplementów..."
                        value={state.filterConfig.searchQuery || ""}
                        onChange={(e) =>
                          dispatch({ type: "SET_FILTER", payload: { ...state.filterConfig, searchQuery: e.target.value } })
                        }
                        className="pl-8 w-[200px]"
                      />
                    </div>

                    {/* Filters */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filtry
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <div className="p-2">
                          <label className="text-sm font-medium">Kategoria</label>
                          <Select
                            value={state.filterConfig.category?.[0] || ""}
                            onValueChange={(value) =>
                              dispatch({
                                type: "SET_FILTER",
                                payload: { ...state.filterConfig, category: value ? [value as SupplementCategory] : undefined }
                              })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Wszystkie kategorie" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Wszystkie kategorie</SelectItem>
                              <SelectItem value="VITAMIN">Witaminy</SelectItem>
                              <SelectItem value="MINERAL">Minerały</SelectItem>
                              <SelectItem value="NOOTROPIC">Nootropiki</SelectItem>
                              <SelectItem value="HERB">Zioła</SelectItem>
                              <SelectItem value="ADAPTOGEN">Adaptogeny</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="p-2 border-t">
                          <label className="text-sm font-medium">Poziom dowodów</label>
                          <Select
                            value={state.filterConfig.evidenceLevel?.[0] || ""}
                            onValueChange={(value) =>
                              dispatch({
                                type: "SET_FILTER",
                                payload: { ...state.filterConfig, evidenceLevel: value ? [value as EvidenceLevel] : undefined }
                              })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Wszystkie poziomy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Wszystkie poziomy</SelectItem>
                              <SelectItem value="STRONG">Silne</SelectItem>
                              <SelectItem value="MODERATE">Umiarkowane</SelectItem>
                              <SelectItem value="WEAK">Słabe</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Column Visibility */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Kolumny
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {DEFAULT_COLUMNS.map((column) => (
                          <DropdownMenuCheckboxItem
                            key={column.key}
                            checked={state.customization.visibleColumns.includes(column.key)}
                            onCheckedChange={() => toggleColumn(column.key)}
                          >
                            {column.polishLabel}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Customization Panel */}
                    {showCustomization && (
                      <Sheet open={showCustomizationPanel} onOpenChange={setShowCustomizationPanel}>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Dostosuj
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                          <SheetHeader>
                            <SheetTitle>Dostosuj tabelę</SheetTitle>
                            <SheetDescription>
                              Dostosuj wygląd i zachowanie tabeli porównawczej
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-6">
                            <TableCustomizationPanel
                              customization={state.customization}
                              availableColumns={availableColumns}
                              onCustomizationChange={(newCustomization) =>
                                dispatch({ type: "SET_CUSTOMIZATION", payload: newCustomization })
                              }
                            />
                          </div>
                        </SheetContent>
                      </Sheet>
                    )}

                    {/* Export */}
                    {showExport && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Eksportuj
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => exportData({ format: "json", includeAllColumns: true })}>
                            Eksportuj jako JSON
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => exportData({ format: "csv", includeAllColumns: true })}>
                            Eksportuj jako CSV
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    {/* Clear Selection */}
                    {state.selection.selectedSupplements.length > 0 && (
                      <Button variant="outline" size="sm" onClick={clearSelection}>
                        <X className="h-4 w-4 mr-2" />
                        Wyczyść wybór ({state.selection.selectedSupplements.length})
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </ResponsiveTableControls>

          {/* Responsive Table Content */}
          <ResponsiveTableWrapper
            supplements={sortedAndFilteredSupplements}
            visibleColumns={visibleColumns}
            sortConfig={state.sortConfig}
            onSort={toggleSort}
            onSupplementClick={(supplement) => {
              // Handle supplement click for mobile detailed view
              console.log("Supplement clicked:", supplement);
            }}
          />

          {sortedAndFilteredSupplements.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Brak suplementów do wyświetlenia. Zmień filtry lub wyszukiwanie.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Standard Table View */
        <Card>
          <CardContent className="p-0">
            <div className="relative overflow-x-auto">
              <Table className={state.customization.showBorders ? "border" : ""}>
                <TableHeader>
                  <TableRow>
                    {visibleColumns.map((column) => (
                      <TableHead
                        key={column.key}
                        className={`w-[${column.width}px] ${column.align === "center" ? "text-center" : ""} ${column.align === "right" ? "text-right" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{column.polishLabel}</span>
                          {column.sortable && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => toggleSort(column.key)}
                            >
                              {state.sortConfig?.key === column.key ? (
                                state.sortConfig.direction === "asc" ? (
                                  <ArrowUp className="h-4 w-4" />
                                ) : (
                                  <ArrowDown className="h-4 w-4" />
                                )
                              ) : (
                                <ArrowUpDown className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAndFilteredSupplements.map((supplement) => (
                    <TableRow
                      key={supplement.id}
                      className={`${
                        state.selection.selectedSupplements.includes(supplement.id)
                          ? "bg-muted/50"
                          : ""
                      } ${state.customization.highlightDifferences ? "hover:bg-muted/30" : ""}`}
                    >
                      {visibleColumns.map((column) => {
                        const cellValue = (supplement as any)[column.key];

                        return (
                          <TableCell
                            key={column.key}
                            className={`${densityClasses[state.customization.density]} ${
                              column.align === "center" ? "text-center" : ""
                            } ${column.align === "right" ? "text-right" : ""}`}
                          >
                            {column.render
                              ? column.render(
                                  column.key === "selection"
                                    ? state.selection.selectedSupplements.includes(supplement.id)
                                    : cellValue,
                                  supplement
                                )
                              : cellValue}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {sortedAndFilteredSupplements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Brak suplementów do wyświetlenia. Zmień filtry lub wyszukiwanie.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}