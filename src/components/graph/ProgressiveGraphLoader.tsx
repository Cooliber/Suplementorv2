"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Clock,
	Database,
	Eye,
	EyeOff,
	Loader2,
	Pause,
	Play,
	RotateCcw,
	TrendingUp,
	Zap,
} from "lucide-react";
import React, { useState, useEffect, useMemo, Suspense, lazy } from "react";

import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";

// Lazy load heavy components for better performance
const GraphDashboard = lazy(() => import("./GraphDashboard"));
const WebGLGraphVisualization = lazy(() => import("./WebGLGraphVisualization"));

interface ProgressiveGraphLoaderProps {
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	supplements: SupplementWithRelations[];
	onDataLoad?: (data: {
		nodes: KnowledgeNode[];
		relationships: KnowledgeRelationship[];
	}) => void;
	className?: string;
	enableWebGL?: boolean;
	batchSize?: number;
	loadingDelay?: number;
	maxNodes?: number;
}

interface LoadingBatch {
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	batchNumber: number;
	totalBatches: number;
}

// Loading skeleton component
const GraphLoadingSkeleton: React.FC<{
	progress: number;
	currentBatch: number;
	totalBatches: number;
	loadedNodes: number;
	totalNodes: number;
}> = ({ progress, currentBatch, totalBatches, loadedNodes, totalNodes }) => (
	<Card className="h-[600px]">
		<CardHeader>
			<CardTitle className="flex items-center gap-2">
				<Loader2 className="h-5 w-5 animate-spin" />
				Ładowanie grafu wiedzy...
			</CardTitle>
		</CardHeader>
		<CardContent className="space-y-4">
			<div className="space-y-2">
				<div className="flex justify-between text-sm">
					<span>Postęp ładowania</span>
					<span>{Math.round(progress)}%</span>
				</div>
				<Progress value={progress} className="h-2" />
			</div>

			<div className="grid grid-cols-2 gap-4 text-sm">
				<div>
					<div className="text-gray-600">Pakiet danych</div>
					<div className="font-medium">
						{currentBatch} z {totalBatches}
					</div>
				</div>
				<div>
					<div className="text-gray-600">Węzły</div>
					<div className="font-medium">
						{loadedNodes} z {totalNodes}
					</div>
				</div>
			</div>

			{/* Animated skeleton */}
			<div className="relative h-96 overflow-hidden rounded-lg bg-gray-100">
				<div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />

				{/* Simulated nodes */}
				{Array.from({ length: Math.min(loadedNodes, 20) }).map((_, i) => (
					<div
						key={i}
						className="absolute h-3 w-3 animate-pulse rounded-full bg-blue-300"
						style={{
							left: `${20 + (i % 5) * 15}%`,
							top: `${20 + Math.floor(i / 5) * 15}%`,
							animationDelay: `${i * 100}ms`,
						}}
					/>
				))}

				{/* Simulated connections */}
				{Array.from({ length: Math.min(Math.floor(loadedNodes / 2), 10) }).map(
					(_, i) => (
						<div
							key={`line-${i}`}
							className="absolute h-px animate-pulse bg-gray-300"
							style={{
								left: `${25 + (i % 3) * 20}%`,
								top: `${30 + Math.floor(i / 3) * 20}%`,
								width: "10%",
								animationDelay: `${i * 150}ms`,
							}}
						/>
					),
				)}
			</div>

			<div className="text-center text-gray-600 text-sm">
				Przygotowywanie interaktywnej wizualizacji...
			</div>
		</CardContent>
	</Card>
);

// Error boundary for progressive loading
class ProgressiveLoadingErrorBoundary extends React.Component<
	{ children: React.ReactNode; onError?: (error: Error) => void },
	{ hasError: boolean; error?: Error }
> {
	constructor(props: any) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Progressive loading error:", error, errorInfo);
		this.props.onError?.(error);
	}

	override render() {
		if (this.state.hasError) {
			return (
				<Card className="h-[600px]">
					<CardContent className="flex h-full items-center justify-center">
						<Alert className="max-w-md">
							<AlertDescription>
								Wystąpił błąd podczas ładowania grafu. Spróbuj odświeżyć stronę.
							</AlertDescription>
						</Alert>
					</CardContent>
				</Card>
			);
		}

		return this.props.children;
	}
}

const ProgressiveGraphLoader: React.FC<ProgressiveGraphLoaderProps> = ({
	nodes,
	relationships,
	supplements,
	onDataLoad,
	className = "",
	enableWebGL = false,
	batchSize = 50,
	loadingDelay = 100,
	maxNodes = 1000,
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [loadedNodes, setLoadedNodes] = useState<KnowledgeNode[]>([]);
	const [loadedRelationships, setLoadedRelationships] = useState<
		KnowledgeRelationship[]
	>([]);
	const [currentBatch, setCurrentBatch] = useState(0);
	const [isPlaying, setIsPlaying] = useState(true);
	const [loadingError, setLoadingError] = useState<string | null>(null);
	const [showPreview, setShowPreview] = useState(true);

	// Prepare data batches with Polish text optimization
	const dataBatches = useMemo(() => {
		const limitedNodes = nodes.slice(0, maxNodes);
		const nodeIds = new Set(limitedNodes.map((n) => n.id));
		const validRelationships = relationships.filter(
			(r) => nodeIds.has(r.sourceId) && nodeIds.has(r.targetId),
		);

		// Sort nodes by importance for better progressive loading
		const sortedNodes = [...limitedNodes].sort(
			(a, b) => (b.importance || 0) - (a.importance || 0),
		);

		const batches: LoadingBatch[] = [];
		const totalBatches = Math.ceil(sortedNodes.length / batchSize);

		for (let i = 0; i < totalBatches; i++) {
			const batchNodes = sortedNodes.slice(i * batchSize, (i + 1) * batchSize);
			const batchNodeIds = new Set(batchNodes.map((n) => n.id));

			// Include relationships that connect to already loaded nodes
			const loadedNodeIds = new Set(
				sortedNodes.slice(0, (i + 1) * batchSize).map((n) => n.id),
			);
			const batchRelationships = validRelationships.filter(
				(r) => loadedNodeIds.has(r.sourceId) && loadedNodeIds.has(r.targetId),
			);

			batches.push({
				nodes: batchNodes,
				relationships: batchRelationships,
				batchNumber: i + 1,
				totalBatches,
			});
		}

		return batches;
	}, [nodes, relationships, batchSize, maxNodes]);

	// Progressive loading logic
	useEffect(() => {
		if (!isPlaying || currentBatch >= dataBatches.length) {
			return;
		}

		const timer = setTimeout(() => {
			try {
				const batch = dataBatches[currentBatch];

				if (batch) {
					// Add new nodes (avoiding duplicates)
					setLoadedNodes((prev) => {
						const existingIds = new Set(prev.map((n) => n.id));
						const newNodes = batch.nodes.filter((n) => !existingIds.has(n.id));
						return [...prev, ...newNodes];
					});

					// Update relationships with all valid connections
					setLoadedRelationships(batch.relationships);

					setCurrentBatch((prev) => prev + 1);

					// Call onDataLoad callback
					if (onDataLoad) {
						onDataLoad({
							nodes: loadedNodes.concat(batch.nodes),
							relationships: batch.relationships,
						});
					}
				}
			} catch (error) {
				console.error("Error during progressive loading:", error);
				setLoadingError("Błąd podczas ładowania danych grafu");
				setIsPlaying(false);
			}
		}, loadingDelay);

		return () => clearTimeout(timer);
	}, [
		currentBatch,
		dataBatches,
		isPlaying,
		loadingDelay,
		onDataLoad,
		loadedNodes,
	]);

	// Complete loading when all batches are processed
	useEffect(() => {
		if (currentBatch >= dataBatches.length && dataBatches.length > 0) {
			setIsLoading(false);
		}
	}, [currentBatch, dataBatches.length]);

	// Calculate progress
	const progress =
		dataBatches.length > 0 ? (currentBatch / dataBatches.length) * 100 : 0;

	// Control functions
	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	const handleReset = () => {
		setCurrentBatch(0);
		setLoadedNodes([]);
		setLoadedRelationships([]);
		setIsLoading(true);
		setIsPlaying(true);
		setLoadingError(null);
	};

	const handleSkipToEnd = () => {
		setLoadedNodes(nodes.slice(0, maxNodes));
		setLoadedRelationships(relationships);
		setCurrentBatch(dataBatches.length);
		setIsLoading(false);
		setIsPlaying(false);
	};

	// Error handling
	const handleLoadingError = (error: Error) => {
		setLoadingError(error.message);
		setIsPlaying(false);
	};

	if (loadingError) {
		return (
			<Card className={className}>
				<CardContent className="flex h-[600px] items-center justify-center">
					<Alert className="max-w-md">
						<AlertDescription>
							{loadingError}
							<Button
								variant="outline"
								size="sm"
								onClick={handleReset}
								className="mt-2 w-full"
							>
								<RotateCcw className="mr-2 h-4 w-4" />
								Spróbuj ponownie
							</Button>
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	return (
		<ProgressiveLoadingErrorBoundary onError={handleLoadingError}>
			<div className={`space-y-4 ${className}`}>
				{/* Loading Controls */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<Button
									variant="outline"
									size="sm"
									onClick={handlePlayPause}
									disabled={!isLoading}
								>
									{isPlaying ? (
										<Pause className="mr-2 h-4 w-4" />
									) : (
										<Play className="mr-2 h-4 w-4" />
									)}
									{isPlaying ? "Pauza" : "Wznów"}
								</Button>

								<Button variant="outline" size="sm" onClick={handleReset}>
									<RotateCcw className="mr-2 h-4 w-4" />
									Reset
								</Button>

								{isLoading && (
									<Button variant="outline" size="sm" onClick={handleSkipToEnd}>
										<Zap className="mr-2 h-4 w-4" />
										Pomiń do końca
									</Button>
								)}

								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowPreview(!showPreview)}
								>
									{showPreview ? (
										<EyeOff className="mr-2 h-4 w-4" />
									) : (
										<Eye className="mr-2 h-4 w-4" />
									)}
									{showPreview ? "Ukryj podgląd" : "Pokaż podgląd"}
								</Button>
							</div>

							<div className="flex items-center gap-4">
								<Badge variant="outline">
									<Database className="mr-1 h-3 w-3" />
									{loadedNodes.length} węzłów
								</Badge>
								<Badge variant="outline">
									<TrendingUp className="mr-1 h-3 w-3" />
									{loadedRelationships.length} połączeń
								</Badge>
								{isLoading && (
									<Badge variant="outline">
										<Clock className="mr-1 h-3 w-3" />
										Ładowanie...
									</Badge>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Graph Visualization */}
				{isLoading && showPreview ? (
					<GraphLoadingSkeleton
						progress={progress}
						currentBatch={currentBatch}
						totalBatches={dataBatches.length}
						loadedNodes={loadedNodes.length}
						totalNodes={Math.min(nodes.length, maxNodes)}
					/>
				) : (
					<Suspense
						fallback={
							<GraphLoadingSkeleton
								progress={100}
								currentBatch={dataBatches.length}
								totalBatches={dataBatches.length}
								loadedNodes={loadedNodes.length}
								totalNodes={loadedNodes.length}
							/>
						}
					>
						{enableWebGL ? (
							<WebGLGraphVisualization
								nodes={loadedNodes}
								relationships={loadedRelationships}
								width={800}
								height={600}
								qualityLevel={loadedNodes.length > 500 ? "low" : "medium"}
							/>
						) : (
							<GraphDashboard
								nodes={loadedNodes}
								relationships={loadedRelationships}
								supplements={supplements}
								className="h-[600px]"
							/>
						)}
					</Suspense>
				)}

				{/* Loading Statistics */}
				{(isLoading || loadedNodes.length > 0) && (
					<Card>
						<CardContent className="p-4">
							<div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
								<div>
									<div className="font-bold text-2xl text-blue-600">
										{Math.round(progress)}%
									</div>
									<div className="text-gray-600 text-xs">Postęp</div>
								</div>
								<div>
									<div className="font-bold text-2xl text-green-600">
										{loadedNodes.length}
									</div>
									<div className="text-gray-600 text-xs">Węzły</div>
								</div>
								<div>
									<div className="font-bold text-2xl text-purple-600">
										{loadedRelationships.length}
									</div>
									<div className="text-gray-600 text-xs">Połączenia</div>
								</div>
								<div>
									<div className="font-bold text-2xl text-orange-600">
										{currentBatch}
									</div>
									<div className="text-gray-600 text-xs">Pakiet</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</ProgressiveLoadingErrorBoundary>
	);
};

export default ProgressiveGraphLoader;
