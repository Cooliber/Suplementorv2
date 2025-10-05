"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Network, RefreshCw, AlertTriangle } from 'lucide-react';

export interface GraphDashboardProps {
  nodes?: any[];
  relationships?: any[];
  supplements?: any[];
  onDataLoad?: (data: any) => void;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
  onNodeSelect?: (node: any) => void;
  onRelationshipSelect?: (relationship: any) => void;
}

export default function GraphDashboard({
  nodes = [],
  relationships = [],
  supplements = [],
  onDataLoad,
  className,
  isLoading = false,
  error = null,
  onNodeSelect,
  onRelationshipSelect
}: GraphDashboardProps) {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Graf Wiedzy o Suplementach
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-muted-foreground">Ładowanie grafu wiedzy...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-red-600">Błąd ładowania</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => onDataLoad?.({ nodes, relationships, supplements })}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Spróbuj ponownie
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Network className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Graf Wiedzy</h3>
              <p className="text-muted-foreground mb-4">
                Interaktywny graf pokazujący połączenia między suplementami, neurotransmiterami i funkcjami poznawczymi.
              </p>
              <div className="flex gap-2 mb-4">
                <Badge variant="secondary">{nodes.length} Węzłów</Badge>
                <Badge variant="secondary">{relationships.length} Połączeń</Badge>
                <Badge variant="secondary">{supplements.length} Suplementów</Badge>
              </div>
              <Button onClick={() => onDataLoad?.({ nodes, relationships, supplements })}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Załaduj Graf
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
