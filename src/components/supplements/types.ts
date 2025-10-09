/**
 * Types for Supplement Comparison Table Components
 */

import type { SupplementWithRelations, SupplementCategory, EvidenceLevel } from "@/types/supplement";

// Table column configuration
export interface TableColumn {
  key: string;
  label: string;
  polishLabel: string;
  sortable: boolean;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, supplement: SupplementWithRelations) => React.ReactNode;
}

// Sort configuration
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Filter configuration
export interface FilterConfig {
  category?: SupplementCategory[];
  evidenceLevel?: EvidenceLevel[];
  searchQuery?: string;
  minResearchCount?: number;
}

// Table customization options
export interface TableCustomization {
  visibleColumns: string[];
  density: 'compact' | 'normal' | 'comfortable';
  showBorders: boolean;
  highlightDifferences: boolean;
}

// Comparison selection
export interface ComparisonSelection {
  selectedSupplements: string[];
  comparisonMode: 'single' | 'multiple' | 'side-by-side';
}

// Export options
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  includeAllColumns: boolean;
  selectedColumns?: string[];
  filename?: string;
}

// Table state
export interface TableState {
  supplements: SupplementWithRelations[];
  sortConfig: SortConfig | null;
  filterConfig: FilterConfig;
  customization: TableCustomization;
  selection: ComparisonSelection;
  loading: boolean;
  error?: string;
}

// Table actions
export type TableAction =
  | { type: 'SET_SUPPLEMENTS'; payload: SupplementWithRelations[] }
  | { type: 'SET_SORT'; payload: SortConfig | null }
  | { type: 'SET_FILTER'; payload: FilterConfig }
  | { type: 'SET_CUSTOMIZATION'; payload: TableCustomization }
  | { type: 'SET_SELECTION'; payload: ComparisonSelection }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'TOGGLE_COLUMN'; payload: string }
  | { type: 'TOGGLE_SUPPLEMENT'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'RESET_TABLE' };

// Hook return types
export interface UseSupplementTableReturn {
  state: TableState;
  dispatch: React.Dispatch<TableAction>;
  sortedAndFilteredSupplements: SupplementWithRelations[];
  availableColumns: TableColumn[];
  toggleSort: (key: string) => void;
  toggleColumn: (key: string) => void;
  toggleSupplement: (id: string) => void;
  clearSelection: () => void;
  exportData: (options: ExportOptions) => void;
  resetTable: () => void;
}

// Component prop types
export interface SupplementComparisonTableProps {
  supplements?: SupplementWithRelations[];
  initialColumns?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onExport?: (data: any[], format: string) => void;
  className?: string;
  showCustomization?: boolean;
  showExport?: boolean;
  maxSelection?: number;
}

export interface ComparisonViewProps {
  selectedSupplements: SupplementWithRelations[];
  onRemove?: (id: string) => void;
  className?: string;
}

export interface TableCustomizationPanelProps {
  customization: TableCustomization;
  availableColumns: TableColumn[];
  onCustomizationChange: (customization: TableCustomization) => void;
  className?: string;
}