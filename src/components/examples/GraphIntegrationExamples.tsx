"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Brain,
	CheckCircle,
	Code,
	Copy,
	Database,
	ExternalLink,
	Network,
	Play,
	Settings,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

// Import graph components and hooks
import GraphDashboard from "@/components/graph/GraphDashboard";
import { useGraphData } from "@/hooks/useGraphData";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import { api } from "@/trpc/react";

// Code examples for different integration patterns
const codeExamples = {
	basicUsage: `// Basic Graph Integration
import { GraphDashboard, useGraphData } from '@/components/graph';

function MyGraphPage() {
  const { nodes, relationships, supplements, isLoading } = useGraphData({
    includeSupplements: true,
    includeNeurotransmitters: true,
    maxNodes: 300
  });

  if (isLoading) return <div>Ładowanie...</div>;

  return (
    <GraphDashboard
      nodes={nodes}
      relationships={relationships}
      supplements={supplements}
      className="h-[600px]"
    />
  );
}`,

	withFiltering: `// Graph with Advanced Filtering
import { useGraphData, useFilteredGraphData } from '@/hooks/useGraphData';
import { useKnowledgeGraphStore } from '@/lib/stores/knowledge-graph-store';

function FilteredGraphExample() {
  const { nodes, relationships } = useGraphData();
  const { filters } = useKnowledgeGraphStore();
  
  const filteredData = useFilteredGraphData(nodes, relationships, {
    ...filters,
    searchTerm: 'omega',
    nodeTypes: ['SUPPLEMENT', 'NEUROTRANSMITTER'],
    minStrength: 0.7
  });
  
  return (
    <GraphDashboard
      nodes={filteredData.nodes}
      relationships={filteredData.relationships}
      supplements={supplements}
    />
  );
}`,

	tRPCIntegration: `// tRPC Integration with Real-time Updates
import { api } from '@/utils/api';

function TRPCGraphExample() {
  const { data: graphData, isLoading } = api.knowledgeGraph.generate.useQuery({
    includeSupplements: true,
    maxNodes: 500
  });

  const updateGraphMutation = api.knowledgeGraph.update.useMutation({
    onSuccess: () => {
      // Invalidate and refetch
      utils.knowledgeGraph.generate.invalidate();
    }
  });

  return (
    <div>
      <Button 
        onClick={() => updateGraphMutation.mutate({ refresh: true })}
        disabled={updateGraphMutation.isLoading}
      >
        Odśwież graf
      </Button>
      
      {graphData && (
        <GraphDashboard
          nodes={graphData.nodes}
          relationships={graphData.relationships}
          supplements={graphData.supplements}
        />
      )}
    </div>
  );
}`,

	storeIntegration: `// Zustand Store Integration
import { useKnowledgeGraphStore } from '@/lib/stores/knowledge-graph-store';
import { useSupplementStore } from '@/lib/stores/supplement-store';

function StoreIntegratedGraph() {
  const { 
    selectedNodes, 
    filters, 
    setFilters,
    layout,
    setLayout 
  } = useKnowledgeGraphStore();
  
  const { 
    currentStack, 
    addToStack 
  } = useSupplementStore();

  const handleNodeSelect = (nodeId: string) => {
    // Add supplement to current stack when selected
    const supplement = supplements.find(s => s.id === nodeId);
    if (supplement) {
      addToStack({
        supplementId: nodeId,
        name: supplement.polishName,
        dosage: supplement.dosageGuidelines?.therapeuticRange?.min || 0,
        timing: 'morning'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={() => setLayout('force')}>Układ siłowy</Button>
        <Button onClick={() => setLayout('hierarchical')}>Hierarchiczny</Button>
        <Button onClick={() => setLayout('circular')}>Kołowy</Button>
      </div>
      
      <GraphDashboard
        nodes={nodes}
        relationships={relationships}
        supplements={supplements}
        onNodeSelect={handleNodeSelect}
      />
      
      <div>
        <h3>Aktualny stos ({currentStack.length} suplementów)</h3>
        {currentStack.map(item => (
          <Badge key={item.supplementId}>{item.name}</Badge>
        ))}
      </div>
    </div>
  );
}`,

	customVisualization: `// Custom Visualization with D3 and Cytoscape
import { useState } from 'react';
import { D3GraphVisualization, CytoscapeVisualization } from '@/components/graph';

function CustomVisualizationExample() {
  const [engine, setEngine] = useState<'d3' | 'cytoscape'>('d3');
  const { nodes, relationships } = useGraphData();

  return (
    <div>
      <div className="mb-4">
        <Button 
          variant={engine === 'd3' ? 'default' : 'outline'}
          onClick={() => setEngine('d3')}
        >
          D3.js
        </Button>
        <Button 
          variant={engine === 'cytoscape' ? 'default' : 'outline'}
          onClick={() => setEngine('cytoscape')}
        >
          Cytoscape.js
        </Button>
      </div>
      
      {engine === 'd3' ? (
        <D3GraphVisualization
          nodes={nodes}
          relationships={relationships}
          width={800}
          height={600}
          onNodeClick={(nodeId) => console.log('Clicked:', nodeId)}
        />
      ) : (
        <CytoscapeVisualization
          nodes={nodes}
          relationships={relationships}
          width={800}
          height={600}
          layout="cose"
        />
      )}
    </div>
  );
}`,

	performanceOptimized: `// Performance Optimized for Large Datasets
import { useMemo } from 'react';
import { useGraphData } from '@/hooks/useGraphData';

function PerformanceOptimizedGraph() {
  const { nodes, relationships, isLoading } = useGraphData({
    maxNodes: 1000,
    includeSupplements: true,
    includeNeurotransmitters: true
  });

  // Memoize expensive calculations
  const processedData = useMemo(() => {
    if (nodes.length > 500) {
      // Use simplified rendering for large datasets
      return {
        nodes: nodes.slice(0, 500),
        relationships: relationships.filter(rel => 
          rel.strength > 0.5 && rel.evidenceLevel === 'STRONG'
        )
      };
    }
    return { nodes, relationships };
  }, [nodes, relationships]);

  // Progressive loading
  const [loadedNodes, setLoadedNodes] = useState(50);
  
  useEffect(() => {
    if (!isLoading && nodes.length > loadedNodes) {
      const timer = setTimeout(() => {
        setLoadedNodes(prev => Math.min(prev + 50, nodes.length));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, nodes.length, loadedNodes]);

  return (
    <div>
      {isLoading && (
        <div>Ładowanie: {loadedNodes}/{nodes.length} węzłów</div>
      )}
      
      <GraphDashboard
        nodes={processedData.nodes.slice(0, loadedNodes)}
        relationships={processedData.relationships}
        supplements={supplements}
        className="h-[600px]"
      />
    </div>
  );
}`,
};

interface GraphIntegrationExamplesProps {
	className?: string;
}

const GraphIntegrationExamples: React.FC<GraphIntegrationExamplesProps> = ({
	className = "",
}) => {
	const [activeExample, setActiveExample] = useState<string>("basicUsage");
	const [copiedCode, setCopiedCode] = useState<string | null>(null);
	const [runningExample, setRunningExample] = useState<string | null>(null);

	// Sample data for live examples
	const { nodes, relationships, supplements } = useGraphData({
		autoFetch: true,
		maxNodes: 50, // Small dataset for examples
	});

	const handleCopyCode = async (exampleKey: string) => {
		try {
			await navigator.clipboard.writeText(
				codeExamples[exampleKey as keyof typeof codeExamples],
			);
			setCopiedCode(exampleKey);
			setTimeout(() => setCopiedCode(null), 2000);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
	};

	const handleRunExample = (exampleKey: string) => {
		setRunningExample(exampleKey);
		// Simulate running example
		setTimeout(() => setRunningExample(null), 3000);
	};

	const examples = [
		{
			key: "basicUsage",
			title: "Podstawowe użycie",
			description: "Najprostszy sposób integracji grafu wiedzy",
			icon: Network,
			difficulty: "Łatwy",
			tags: ["podstawy", "react", "hooks"],
		},
		{
			key: "withFiltering",
			title: "Graf z filtrowaniem",
			description: "Zaawansowane filtrowanie i wyszukiwanie",
			icon: Settings,
			difficulty: "Średni",
			tags: ["filtrowanie", "wyszukiwanie", "zustand"],
		},
		{
			key: "tRPCIntegration",
			title: "Integracja z tRPC",
			description: "Pobieranie danych przez tRPC z cache'owaniem",
			icon: Database,
			difficulty: "Średni",
			tags: ["trpc", "api", "cache"],
		},
		{
			key: "storeIntegration",
			title: "Integracja ze store",
			description: "Połączenie z Zustand store i zarządzanie stanem",
			icon: Zap,
			difficulty: "Zaawansowany",
			tags: ["zustand", "state", "store"],
		},
		{
			key: "customVisualization",
			title: "Niestandardowa wizualizacja",
			description: "Własne komponenty wizualizacji z D3 i Cytoscape",
			icon: Brain,
			difficulty: "Zaawansowany",
			tags: ["d3", "cytoscape", "custom"],
		},
		{
			key: "performanceOptimized",
			title: "Optymalizacja wydajności",
			description: "Techniki optymalizacji dla dużych zbiorów danych",
			icon: TrendingUp,
			difficulty: "Ekspert",
			tags: ["performance", "optimization", "large-data"],
		},
	];

	return (
		<div className={`space-y-6 ${className}`}>
			<div className="space-y-2 text-center">
				<h2 className="font-bold text-3xl">
					Przykłady Integracji Grafu Wiedzy
				</h2>
				<p className="mx-auto max-w-2xl text-gray-600">
					Poznaj różne sposoby integracji komponentów grafu wiedzy w swojej
					aplikacji. Od podstawowych przykładów po zaawansowane optymalizacje
					wydajności.
				</p>
			</div>

			<Tabs
				value={activeExample}
				onValueChange={setActiveExample}
				className="space-y-6"
			>
				{/* Example Selection */}
				<div className="grid gap-4 md:grid-cols-3">
					{examples.map((example) => {
						const Icon = example.icon;
						return (
							<Card
								key={example.key}
								className={`cursor-pointer transition-all hover:shadow-lg ${
									activeExample === example.key ? "ring-2 ring-blue-500" : ""
								}`}
								onClick={() => setActiveExample(example.key)}
							>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<Icon className="h-6 w-6 text-blue-600" />
										<Badge
											variant={
												example.difficulty === "Łatwy"
													? "secondary"
													: example.difficulty === "Średni"
														? "default"
														: example.difficulty === "Zaawansowany"
															? "destructive"
															: "outline"
											}
										>
											{example.difficulty}
										</Badge>
									</div>
									<CardTitle className="text-lg">{example.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="mb-3 text-gray-600 text-sm">
										{example.description}
									</p>
									<div className="flex flex-wrap gap-1">
										{example.tags.map((tag) => (
											<Badge key={tag} variant="outline" className="text-xs">
												{tag}
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Code Display */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<Code className="h-5 w-5" />
								{examples.find((e) => e.key === activeExample)?.title}
							</CardTitle>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleCopyCode(activeExample)}
									disabled={copiedCode === activeExample}
								>
									{copiedCode === activeExample ? (
										<CheckCircle className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
									{copiedCode === activeExample ? "Skopiowano!" : "Kopiuj"}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleRunExample(activeExample)}
									disabled={runningExample === activeExample}
								>
									<Play className="mr-1 h-4 w-4" />
									{runningExample === activeExample
										? "Uruchamianie..."
										: "Uruchom"}
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-gray-100 text-sm">
							<code>
								{codeExamples[activeExample as keyof typeof codeExamples]}
							</code>
						</pre>
					</CardContent>
				</Card>

				{/* Live Example */}
				{runningExample === activeExample && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Play className="h-5 w-5 text-green-600" />
								Podgląd na żywo
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Alert className="mb-4">
								<ExternalLink className="h-4 w-4" />
								<AlertDescription>
									To jest uproszczony podgląd. W rzeczywistej aplikacji
									komponenty będą w pełni funkcjonalne.
								</AlertDescription>
							</Alert>

							<div className="rounded-lg border bg-gray-50 p-4">
								{activeExample === "basicUsage" && (
									<div className="flex h-64 items-center justify-center rounded border bg-white">
										<div className="text-center">
											<Network className="mx-auto mb-2 h-12 w-12 text-blue-600" />
											<p className="text-gray-600">
												Graf z {nodes.length} węzłami
											</p>
										</div>
									</div>
								)}

								{activeExample === "withFiltering" && (
									<div className="space-y-4">
										<div className="flex gap-2">
											<input
												type="text"
												placeholder="Szukaj..."
												className="rounded border px-3 py-1"
											/>
											<Button size="sm">Filtruj</Button>
										</div>
										<div className="flex h-48 items-center justify-center rounded border bg-white">
											<p className="text-gray-600">Przefiltrowany graf</p>
										</div>
									</div>
								)}

								{activeExample === "storeIntegration" && (
									<div className="space-y-4">
										<div className="flex gap-2">
											<Button size="sm">Układ siłowy</Button>
											<Button size="sm" variant="outline">
												Hierarchiczny
											</Button>
											<Button size="sm" variant="outline">
												Kołowy
											</Button>
										</div>
										<div className="flex h-48 items-center justify-center rounded border bg-white">
											<p className="text-gray-600">Graf z integracją store</p>
										</div>
										<div className="flex gap-2">
											<Badge>Omega-3</Badge>
											<Badge>Magnez</Badge>
											<Badge>Witamina D</Badge>
										</div>
									</div>
								)}

								{/* Add more live examples as needed */}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Integration Tips */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							Wskazówki integracji
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<h4 className="mb-2 font-medium">Wydajność</h4>
								<ul className="space-y-1 text-gray-600 text-sm">
									<li>• Używaj memoizacji dla dużych zbiorów danych</li>
									<li>• Implementuj progressive loading</li>
									<li>• Ogranicz liczbę węzłów (max 500-1000)</li>
									<li>• Używaj React.Suspense dla lazy loading</li>
								</ul>
							</div>
							<div>
								<h4 className="mb-2 font-medium">Najlepsze praktyki</h4>
								<ul className="space-y-1 text-gray-600 text-sm">
									<li>• Zawsze obsługuj stany ładowania i błędów</li>
									<li>• Używaj TypeScript dla bezpieczeństwa typów</li>
									<li>• Implementuj proper error boundaries</li>
									<li>• Testuj z różnymi rozmiarami danych</li>
								</ul>
							</div>
						</div>

						<Separator />

						<div>
							<h4 className="mb-2 font-medium">Zasoby dodatkowe</h4>
							<div className="flex flex-wrap gap-2">
								<Button variant="outline" size="sm">
									<ExternalLink className="mr-1 h-4 w-4" />
									Dokumentacja API
								</Button>
								<Button variant="outline" size="sm">
									<ExternalLink className="mr-1 h-4 w-4" />
									Storybook
								</Button>
								<Button variant="outline" size="sm">
									<ExternalLink className="mr-1 h-4 w-4" />
									GitHub Examples
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</Tabs>
		</div>
	);
};

export default GraphIntegrationExamples;
