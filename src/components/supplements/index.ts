// Supplement Components Exports
export { EnhancedSearchInterface } from "./EnhancedSearchInterface";
export { EnhancedSupplementCard } from "./EnhancedSupplementCard";
export { EnhancedSupplementDetail } from "./EnhancedSupplementDetail";
export { SupplementGrid } from "./SupplementGrid";

// Dashboards & Cards
export { default as ComprehensiveSupplementCard } from "./ComprehensiveSupplementCard";
export { default as EnhancedSupplementDashboard } from "./EnhancedSupplementDashboard";
export { default as SupplementSelector } from "./SupplementSelector";
export { default as InteractionMatrix } from "./InteractionMatrix";

// Advanced Filtering System
export { AdvancedSupplementFilters } from "./AdvancedSupplementFilters";
export { DetailedFilterPopover } from "./DetailedFilterPopover";
export { SupplementFilterSystem } from "./SupplementFilterSystem";
export { FilterSystemExample } from "./FilterSystemExample";

// Filter Types and Hooks
export type {
	FilterState,
	FilterPreset,
	FilterAnalytics,
	UrlFilterState,
	UseFiltersReturn,
	SortOption,
} from "@/types/filters";

export { useFilters } from "@/hooks/useFilters";
export { useDebounce } from "@/hooks/useDebounce";

// Filter Logic Utilities
export {
	filterSupplements,
	analyzeFilters,
	extractFilterOptions,
} from "@/lib/filters/filterLogic";

// Comparison Table System
export { SupplementComparisonTable } from "./SupplementComparisonTable";
export { ComparisonView } from "./ComparisonView";
export { SupplementComparisonDashboard } from "./SupplementComparisonDashboard";
export { TableCustomizationPanel } from "./TableCustomizationPanel";
export {
	ResponsiveTableWrapper,
	ResponsiveTableControls,
} from "./ResponsiveTableWrapper";
export { AdvancedTableFilters } from "./AdvancedTableFilters";

// Table Types and Hooks
export type {
	TableColumn,
	SortConfig,
	FilterConfig,
	TableCustomization,
	ComparisonSelection,
	ExportOptions,
	TableState,
	TableAction,
	UseSupplementTableReturn,
	SupplementComparisonTableProps,
	ComparisonViewProps,
	TableCustomizationPanelProps,
} from "./types";

export { useSupplementTable } from "./useSupplementTable";

// Table Configuration
export {
	DEFAULT_COLUMNS,
	getColumnByKey,
	getSortableColumns,
	getDefaultVisibleColumns,
	formatSupplementForComparison,
} from "./table-config";

// Export Utilities
export {
	exportSupplementData,
	getAvailableExportFormats,
	validateExportOptions,
} from "./export-utils";
