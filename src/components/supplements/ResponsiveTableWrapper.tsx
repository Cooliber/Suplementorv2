/**
 * Responsive Table Wrapper for Mobile Devices
 * Provides mobile-optimized table display with card-based layout
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Smartphone,
  Tablet,
  Monitor,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  Eye,
  Filter,
} from "lucide-react";

import type { SupplementWithRelations } from "@/types/supplement";
import type { TableColumn } from "./types";

interface ResponsiveTableWrapperProps {
  supplements: SupplementWithRelations[];
  visibleColumns: TableColumn[];
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
  onSort?: (key: string) => void;
  onSupplementClick?: (supplement: SupplementWithRelations) => void;
  className?: string;
}

// Hook to detect screen size
function useScreenSize() {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize("mobile");
      } else if (window.innerWidth < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return screenSize;
}

// Mobile card component
function MobileSupplementCard({
  supplement,
  visibleColumns,
  onClick,
}: {
  supplement: SupplementWithRelations;
  visibleColumns: TableColumn[];
  onClick?: () => void;
}) {
  const getColumnValue = (column: TableColumn) => {
    const value = (supplement as any)[column.key];

    if (column.render) {
      return column.render(value, supplement);
    }

    switch (column.key) {
      case "name":
        return (
          <div className="font-medium">
            {supplement.name}
            <div className="text-sm text-muted-foreground">{supplement.polishName}</div>
          </div>
        );
      case "category":
        return <Badge variant="outline">{value}</Badge>;
      case "evidenceLevel":
        const colorMap = {
          STRONG: "bg-green-100 text-green-800",
          MODERATE: "bg-blue-100 text-blue-800",
          WEAK: "bg-yellow-100 text-yellow-800",
          INSUFFICIENT: "bg-gray-100 text-gray-800",
          CONFLICTING: "bg-red-100 text-red-800",
        };
        return <Badge className={colorMap[value as keyof typeof colorMap]}>{value}</Badge>;
      case "dosage":
        return (
          <div className="text-sm">
            <div className="font-medium">
              {supplement.dosageGuidelines.therapeuticRange.min} - {supplement.dosageGuidelines.therapeuticRange.max} {supplement.dosageGuidelines.therapeuticRange.unit}
            </div>
          </div>
        );
      case "researchCount":
        return (
          <div className="text-center">
            <div className="font-medium">{supplement.researchStudies.length}</div>
            <div className="text-xs text-muted-foreground">badań</div>
          </div>
        );
      default:
        return String(value || "-");
    }
  };

  return (
    <Card className={`cursor-pointer transition-colors hover:bg-muted/50 ${onClick ? "" : "cursor-default"}`} onClick={onClick}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with name and category */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {getColumnValue(visibleColumns.find(col => col.key === "name")!)}
            </div>
            <div className="flex flex-col items-end gap-1">
              {getColumnValue(visibleColumns.find(col => col.key === "category")!)}
              {getColumnValue(visibleColumns.find(col => col.key === "evidenceLevel")!)}
            </div>
          </div>

          {/* Key information in a grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {visibleColumns
              .filter(col => !["name", "category", "evidenceLevel", "selection", "visibility"].includes(col.key))
              .slice(0, 4)
              .map((column) => (
                <div key={column.key}>
                  <div className="text-xs text-muted-foreground font-medium">
                    {column.polishLabel}
                  </div>
                  <div className="mt-1">
                    {getColumnValue(column)}
                  </div>
                </div>
              ))}
          </div>

          {/* Show more indicator */}
          {visibleColumns.length > 6 && (
            <div className="text-center pt-2">
              <Badge variant="outline" className="text-xs">
                +{visibleColumns.length - 6} więcej
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Tablet view component (simplified table)
function TabletSupplementTable({
  supplements,
  visibleColumns,
  sortConfig,
  onSort,
}: {
  supplements: SupplementWithRelations[];
  visibleColumns: TableColumn[];
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
  onSort?: (key: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.slice(0, 5).map((column) => (
              <TableHead key={column.key} className="min-w-[120px]">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{column.polishLabel}</span>
                  {column.sortable && onSort && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => onSort(column.key)}
                    >
                      {sortConfig?.key === column.key ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )
                      ) : (
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      )}
                    </Button>
                  )}
                </div>
              </TableHead>
            ))}
            {visibleColumns.length > 5 && (
              <TableHead className="w-[100px]">
                <span className="text-sm">Więcej</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {supplements.map((supplement) => (
            <TableRow key={supplement.id}>
              {visibleColumns.slice(0, 5).map((column) => {
                const value = (supplement as any)[column.key];
                return (
                  <TableCell key={column.key} className="py-3">
                    {column.render ? column.render(value, supplement) : value}
                  </TableCell>
                );
              })}
              {visibleColumns.length > 5 && (
                <TableCell className="py-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{supplement.name}</SheetTitle>
                        <SheetDescription>{supplement.polishName}</SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        {visibleColumns.slice(5).map((column) => {
                          const value = (supplement as any)[column.key];
                          return (
                            <div key={column.key} className="flex justify-between items-center">
                              <span className="font-medium">{column.polishLabel}:</span>
                              <div className="text-right">
                                {column.render ? column.render(value, supplement) : value}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Main responsive wrapper component
export function ResponsiveTableWrapper({
  supplements,
  visibleColumns,
  sortConfig,
  onSort,
  onSupplementClick,
  className = "",
}: ResponsiveTableWrapperProps) {
  const screenSize = useScreenSize();

  // Mobile view - Card layout
  if (screenSize === "mobile") {
    return (
      <div className={`space-y-3 ${className}`}>
        {supplements.map((supplement) => (
          <MobileSupplementCard
            key={supplement.id}
            supplement={supplement}
            visibleColumns={visibleColumns}
            onClick={onSupplementClick ? () => onSupplementClick(supplement) : undefined}
          />
        ))}
      </div>
    );
  }

  // Tablet view - Simplified table
  if (screenSize === "tablet") {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <TabletSupplementTable
            supplements={supplements}
            visibleColumns={visibleColumns}
            sortConfig={sortConfig}
            onSort={onSort}
          />
        </CardContent>
      </Card>
    );
  }

  // Desktop view - Full table (handled by parent component)
  return null;
}

// Responsive controls component
export function ResponsiveTableControls({
  screenSize,
  children,
}: {
  screenSize: "mobile" | "tablet" | "desktop";
  children: React.ReactNode;
}) {
  if (screenSize === "mobile") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Smartphone className="h-4 w-4" />
          <span>Widok mobilny - dotknij kartę aby zobaczyć szczegóły</span>
        </div>
        {children}
      </div>
    );
  }

  if (screenSize === "tablet") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Tablet className="h-4 w-4" />
          <span>Widok tablet - niektóre kolumny ukryte</span>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Monitor className="h-4 w-4" />
      <span>Widok desktop - pełna tabela</span>
    </div>
  );
}