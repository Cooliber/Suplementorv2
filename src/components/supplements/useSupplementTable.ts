/**
 * Custom hook for managing supplement table state
 */

import { useReducer, useMemo, useCallback } from "react";
import type {
  TableState,
  TableAction,
  SortConfig,
  FilterConfig,
  TableCustomization,
  ComparisonSelection,
  ExportOptions,
  UseSupplementTableReturn,
} from "./types";
import { exportSupplementData, validateExportOptions } from "./export-utils";
import {
  DEFAULT_COLUMNS,
  getColumnByKey,
  getSortableColumns,
  getDefaultVisibleColumns,
  formatSupplementForComparison,
} from "./table-config";
import type { SupplementWithRelations } from "@/types/supplement";

// Initial state
const createInitialState = (supplements: SupplementWithRelations[] = []): TableState => ({
  supplements,
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
});

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
      return {
        ...state,
        selection: {
          ...state.selection,
          selectedSupplements: state.selection.selectedSupplements.includes(action.payload)
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
      return createInitialState(state.supplements);
    default:
      return state;
  }
}

// Main hook
export function useSupplementTable(
  initialSupplements: SupplementWithRelations[] = []
): UseSupplementTableReturn {
  const [state, dispatch] = useReducer(tableReducer, createInitialState(initialSupplements));

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
    dispatch({ type: "TOGGLE_SUPPLEMENT", payload: id });
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTION" });
  }, []);

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
    } catch (error) {
      console.error("Export failed:", error);
    }
  }, [sortedAndFilteredSupplements]);

  // Reset table
  const resetTable = useCallback(() => {
    dispatch({ type: "RESET_TABLE" });
  }, []);

  // Get available columns
  const availableColumns = useMemo(() => DEFAULT_COLUMNS, []);

  return {
    state,
    dispatch,
    sortedAndFilteredSupplements,
    availableColumns,
    toggleSort,
    toggleColumn,
    toggleSupplement,
    clearSelection,
    exportData,
    resetTable,
  };
}