/**
 * Table Configuration for Supplement Comparison Table
 */

import type { TableColumn } from "./types";
import type { SupplementWithRelations } from "@/types/supplement";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

// Default table columns configuration
export const DEFAULT_COLUMNS: TableColumn[] = [
  {
    key: "selection",
    label: "Select",
    polishLabel: "Wybierz",
    sortable: false,
    width: 50,
    align: "center",
    render: (value, supplement) => (
      <Checkbox
        checked={value || false}
        onCheckedChange={(checked) => {
          // This will be handled by the parent component
          console.log("Toggle selection for:", supplement.id, checked);
        }}
      />
    ),
  },
  {
    key: "name",
    label: "Supplement",
    polishLabel: "Suplement",
    sortable: true,
    width: 200,
    render: (value, supplement) => (
      <div className="flex flex-col">
        <span className="font-medium">{supplement.name}</span>
        <span className="text-sm text-muted-foreground">{supplement.polishName}</span>
        {supplement.category && (
          <Badge variant="outline" className="w-fit mt-1">
            {supplement.category}
          </Badge>
        )}
      </div>
    ),
  },
  {
    key: "category",
    label: "Category",
    polishLabel: "Kategoria",
    sortable: true,
    width: 120,
    render: (value) => (
      <Badge variant="secondary">
        {value}
      </Badge>
    ),
  },
  {
    key: "evidenceLevel",
    label: "Evidence",
    polishLabel: "Dowody",
    sortable: true,
    width: 100,
    render: (value) => {
      const colorMap = {
        STRONG: "bg-green-100 text-green-800",
        MODERATE: "bg-blue-100 text-blue-800",
        WEAK: "bg-yellow-100 text-yellow-800",
        INSUFFICIENT: "bg-gray-100 text-gray-800",
        CONFLICTING: "bg-red-100 text-red-800",
      };

      return (
        <Badge className={colorMap[value as keyof typeof colorMap]}>
          {value}
        </Badge>
      );
    },
  },
  {
    key: "dosage",
    label: "Dosage",
    polishLabel: "Dawkowanie",
    sortable: false,
    width: 150,
    render: (value, supplement) => (
      <div className="text-sm">
        <div className="font-medium">
          {supplement.dosageGuidelines.therapeuticRange.min} - {supplement.dosageGuidelines.therapeuticRange.max} {supplement.dosageGuidelines.therapeuticRange.unit}
        </div>
        <div className="text-muted-foreground">
          {supplement.dosageGuidelines.timing.join(", ")}
        </div>
      </div>
    ),
  },
  {
    key: "clinicalApplications",
    label: "Applications",
    polishLabel: "Zastosowania",
    sortable: false,
    width: 200,
    render: (value, supplement) => (
      <div className="text-sm">
        {supplement.clinicalApplications.slice(0, 2).map((app, index) => (
          <div key={index} className="mb-1">
            <span className="font-medium">{app.condition}</span>
            <span className="text-muted-foreground ml-1">({app.polishCondition})</span>
          </div>
        ))}
        {supplement.clinicalApplications.length > 2 && (
          <span className="text-muted-foreground">
            +{supplement.clinicalApplications.length - 2} more
          </span>
        )}
      </div>
    ),
  },
  {
    key: "sideEffects",
    label: "Side Effects",
    polishLabel: "Efekty uboczne",
    sortable: false,
    width: 150,
    render: (value, supplement) => {
      const commonEffects = supplement.sideEffects.filter(se => se.frequency === "common");
      return (
        <div className="text-sm">
          {commonEffects.slice(0, 2).map((effect, index) => (
            <div key={index} className="text-muted-foreground">
              {effect.effect}
            </div>
          ))}
          {commonEffects.length === 0 && (
            <span className="text-green-600">Minimal</span>
          )}
        </div>
      );
    },
  },
  {
    key: "interactions",
    label: "Interactions",
    polishLabel: "Interakcje",
    sortable: false,
    width: 150,
    render: (value, supplement) => {
      const severeInteractions = supplement.interactions.filter(i => i.severity === "severe");
      const moderateInteractions = supplement.interactions.filter(i => i.severity === "moderate");

      return (
        <div className="text-sm">
          {severeInteractions.length > 0 && (
            <Badge variant="destructive" className="mr-1">
              {severeInteractions.length} severe
            </Badge>
          )}
          {moderateInteractions.length > 0 && (
            <Badge variant="outline" className="text-yellow-600">
              {moderateInteractions.length} moderate
            </Badge>
          )}
          {severeInteractions.length === 0 && moderateInteractions.length === 0 && (
            <span className="text-green-600">Safe</span>
          )}
        </div>
      );
    },
  },
  {
    key: "researchCount",
    label: "Research",
    polishLabel: "Badania",
    sortable: true,
    width: 100,
    align: "center",
    render: (value, supplement) => (
      <div className="text-center">
        <div className="font-medium">{supplement.researchStudies.length}</div>
        <div className="text-xs text-muted-foreground">studies</div>
      </div>
    ),
  },
  {
    key: "visibility",
    label: "Visibility",
    polishLabel: "Widoczność",
    sortable: false,
    width: 80,
    align: "center",
    render: (value: boolean, supplement: SupplementWithRelations) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          // This will be handled by the parent component
          console.log("Toggle visibility for:", supplement.id);
        }}
      >
        {value ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </Button>
    ),
  },
];

// Helper function to get column by key
export const getColumnByKey = (key: string): TableColumn | undefined => {
  return DEFAULT_COLUMNS.find(col => col.key === key);
};

// Helper function to get sortable columns
export const getSortableColumns = (): TableColumn[] => {
  return DEFAULT_COLUMNS.filter(col => col.sortable);
};

// Helper function to get default visible columns
export const getDefaultVisibleColumns = (): string[] => {
  return DEFAULT_COLUMNS.filter(col => col.key !== "visibility").map(col => col.key);
};

// Helper function to format supplement data for display
export const formatSupplementForComparison = (supplement: SupplementWithRelations) => {
  return {
    id: supplement.id,
    name: supplement.name,
    polishName: supplement.polishName,
    category: supplement.category,
    evidenceLevel: supplement.evidenceLevel,
    dosage: `${supplement.dosageGuidelines.therapeuticRange.min}-${supplement.dosageGuidelines.therapeuticRange.max} ${supplement.dosageGuidelines.therapeuticRange.unit}`,
    clinicalApplications: supplement.clinicalApplications,
    sideEffects: supplement.sideEffects,
    interactions: supplement.interactions,
    researchCount: supplement.researchStudies.length,
    mechanisms: supplement.mechanisms,
    activeCompounds: supplement.activeCompounds,
  };
};