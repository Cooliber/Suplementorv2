"use client";

import { AlertTriangle, Network, RefreshCw } from "lucide-react";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
	onRelationshipSelect,
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
						<div className="flex h-64 flex-col items-center justify-center text-center">
							<div className="mb-4 h-8 w-8 animate-spin rounded-full border-blue-600 border-b-2" />
							<p className="text-muted-foreground">Ładowanie grafu wiedzy...</p>
						</div>
					) : error ? (
						<div className="flex h-64 flex-col items-center justify-center text-center">
							<AlertTriangle className="mb-4 h-16 w-16 text-red-500" />
							<h3 className="mb-2 font-semibold text-lg text-red-600">
								Błąd ładowania
							</h3>
							<p className="mb-4 text-muted-foreground">{error}</p>
							<Button
								onClick={() =>
									onDataLoad?.({ nodes, relationships, supplements })
								}
							>
								<RefreshCw className="mr-2 h-4 w-4" />
								Spróbuj ponownie
							</Button>
						</div>
					) : (
						<div className="flex h-64 flex-col items-center justify-center text-center">
							<Network className="mb-4 h-16 w-16 text-muted-foreground" />
							<h3 className="mb-2 font-semibold text-lg">Graf Wiedzy</h3>
							<p className="mb-4 text-muted-foreground">
								Interaktywny graf pokazujący połączenia między suplementami,
								neurotransmiterami i funkcjami poznawczymi.
							</p>
							<div className="mb-4 flex gap-2">
								<Badge variant="secondary">{nodes.length} Węzłów</Badge>
								<Badge variant="secondary">
									{relationships.length} Połączeń
								</Badge>
								<Badge variant="secondary">
									{supplements.length} Suplementów
								</Badge>
							</div>
							<Button
								onClick={() =>
									onDataLoad?.({ nodes, relationships, supplements })
								}
							>
								<RefreshCw className="mr-2 h-4 w-4" />
								Załaduj Graf
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
