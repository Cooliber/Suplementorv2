// Supplement Components Exports
export { EnhancedSearchInterface } from "./EnhancedSearchInterface";
export { EnhancedSupplementCard } from "./EnhancedSupplementCard";
export { EnhancedSupplementDetail } from "./EnhancedSupplementDetail";
export { SupplementGrid } from "./SupplementGrid";

// Advanced Filtering System
export { AdvancedSupplementFilters } from "./AdvancedSupplementFilters";
export { DetailedFilterPopover } from "./DetailedFilterPopover";
export { SupplementFilterSystem } from "./SupplementFilterSystem";
export { FilterSystemExample } from "./FilterSystemExample";

// Comparison Table System
export { SupplementComparisonTable } from "./SupplementComparisonTable";
export { ComparisonView } from "./ComparisonView";
export { SupplementComparisonDashboard } from "./SupplementComparisonDashboard";

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
