"use client";

import {
	defaultGraphDataOptions,
	graphDataService,
} from "@/lib/services/graph-data-service";
import type { GraphDataServiceOptions } from "@/lib/services/graph-data-service";
import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import { useCallback, useEffect, useState } from "react";

export interface UseGraphDataResult {
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	supplements: SupplementWithRelations[];
	isLoading: boolean;
	error: string | null;
	refetch: (options?: GraphDataServiceOptions) => Promise<void>;
	updateOptions: (options: Partial<GraphDataServiceOptions>) => void;
}

export interface UseGraphDataOptions extends GraphDataServiceOptions {
	autoFetch?: boolean;
	onDataLoaded?: (data: {
		nodes: KnowledgeNode[];
		relationships: KnowledgeRelationship[];
		supplements: SupplementWithRelations[];
	}) => void;
	onError?: (error: string) => void;
}

/**
 * Custom hook for managing graph data with automatic fetching and caching
 */
export function useGraphData(
	options: UseGraphDataOptions = {},
): UseGraphDataResult {
	const {
		autoFetch = true,
		onDataLoaded,
		onError,
		...serviceOptions
	} = options;

	const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
	const [relationships, setRelationships] = useState<KnowledgeRelationship[]>(
		[],
	);
	const [supplements, setSupplements] = useState<SupplementWithRelations[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentOptions, setCurrentOptions] = useState<GraphDataServiceOptions>(
		{
			...defaultGraphDataOptions,
			...serviceOptions,
		},
	);

	const fetchData = useCallback(
		async (fetchOptions?: GraphDataServiceOptions) => {
			setIsLoading(true);
			setError(null);

			try {
				const optionsToUse = fetchOptions || currentOptions;
				const data = await graphDataService.generateGraphData(optionsToUse);

				setNodes(data.nodes);
				setRelationships(data.relationships);
				setSupplements(data.supplements);

				if (onDataLoaded) {
					onDataLoaded(data);
				}
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Unknown error occurred";
				setError(errorMessage);

				if (onError) {
					onError(errorMessage);
				}
			} finally {
				setIsLoading(false);
			}
		},
		[currentOptions, onDataLoaded, onError],
	);

	const updateOptions = useCallback(
		(newOptions: Partial<GraphDataServiceOptions>) => {
			setCurrentOptions((prev) => ({ ...prev, ...newOptions }));
		},
		[],
	);

	const refetch = useCallback(
		async (refetchOptions?: GraphDataServiceOptions) => {
			if (refetchOptions) {
				setCurrentOptions((prev) => ({ ...prev, ...refetchOptions }));
			}
			await fetchData(refetchOptions);
		},
		[fetchData],
	);

	// Auto-fetch on mount and when options change
	useEffect(() => {
		if (autoFetch) {
			fetchData();
		}
	}, [autoFetch, fetchData]);

	return {
		nodes,
		relationships,
		supplements,
		isLoading,
		error,
		refetch,
		updateOptions,
	};
}

/**
 * Hook for filtering graph data based on current store filters
 */
export function useFilteredGraphData(
	nodes: KnowledgeNode[],
	relationships: KnowledgeRelationship[],
	filters: {
		nodeTypes: string[];
		relationshipTypes: string[];
		evidenceLevels: string[];
		searchTerm: string;
		minStrength: number;
		maxStrength: number;
		maxNodes: number;
	},
) {
	const filteredData = useState(() => {
		// Filter nodes
		let filteredNodes = nodes;

		if (filters.nodeTypes.length > 0) {
			filteredNodes = filteredNodes.filter((node) =>
				filters.nodeTypes.includes(node.type),
			);
		}

		if (filters.searchTerm) {
			const searchTerm = filters.searchTerm.toLowerCase();
			filteredNodes = filteredNodes.filter(
				(node) =>
					node.name.toLowerCase().includes(searchTerm) ||
					node.polishName.toLowerCase().includes(searchTerm) ||
					node.description.toLowerCase().includes(searchTerm) ||
					node.polishDescription?.toLowerCase().includes(searchTerm),
			);
		}

		if (filters.evidenceLevels.length > 0) {
			filteredNodes = filteredNodes.filter((node) =>
				filters.evidenceLevels.includes(node.evidenceLevel),
			);
		}

		// Limit nodes
		if (filteredNodes.length > filters.maxNodes) {
			filteredNodes.sort((a, b) => (b.importance || 0) - (a.importance || 0));
			filteredNodes = filteredNodes.slice(0, filters.maxNodes);
		}

		// Filter relationships
		const nodeIds = new Set(filteredNodes.map((n) => n.id));
		let filteredRelationships = relationships.filter(
			(rel) => nodeIds.has(rel.sourceId) && nodeIds.has(rel.targetId),
		);

		if (filters.relationshipTypes.length > 0) {
			filteredRelationships = filteredRelationships.filter((rel) =>
				filters.relationshipTypes.includes(rel.type),
			);
		}

		if (filters.minStrength > 0) {
			filteredRelationships = filteredRelationships.filter(
				(rel) => rel.strength >= filters.minStrength,
			);
		}

		if (filters.maxStrength < 1) {
			filteredRelationships = filteredRelationships.filter(
				(rel) => rel.strength <= filters.maxStrength,
			);
		}

		return {
			nodes: filteredNodes,
			relationships: filteredRelationships,
		};
	});

	return filteredData[0];
}

/**
 * Hook for managing graph data with real-time updates
 */
export function useRealtimeGraphData(options: UseGraphDataOptions = {}) {
	const graphData = useGraphData(options);
	const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

	const refreshData = useCallback(async () => {
		await graphData.refetch();
		setLastUpdate(new Date());
	}, [graphData]);

	// Auto-refresh every 5 minutes
	useEffect(() => {
		const interval = setInterval(refreshData, 5 * 60 * 1000);
		return () => clearInterval(interval);
	}, [refreshData]);

	return {
		...graphData,
		lastUpdate,
		refreshData,
	};
}

/**
 * Hook for managing selected nodes and their relationships
 */
export function useNodeSelection(
	nodes: KnowledgeNode[],
	relationships: KnowledgeRelationship[],
) {
	const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
	const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

	const selectedNodes = useState(() =>
		nodes.filter((node) => selectedNodeIds.includes(node.id)),
	)[0];

	const focusedNode = useState(() =>
		focusedNodeId
			? nodes.find((node) => node.id === focusedNodeId) || null
			: null,
	)[0];

	const selectedRelationships = useState(() =>
		relationships.filter(
			(rel) =>
				selectedNodeIds.includes(rel.sourceId) ||
				selectedNodeIds.includes(rel.targetId),
		),
	)[0];

	const connectedNodes = useState(() => {
		if (!focusedNodeId) return [];

		const connectedIds = new Set<string>();
		relationships.forEach((rel) => {
			if (rel.sourceId === focusedNodeId) connectedIds.add(rel.targetId);
			if (rel.targetId === focusedNodeId) connectedIds.add(rel.sourceId);
		});

		return nodes.filter((node) => connectedIds.has(node.id));
	})[0];

	const addSelectedNode = useCallback((nodeId: string) => {
		setSelectedNodeIds((prev) =>
			prev.includes(nodeId) ? prev : [...prev, nodeId],
		);
	}, []);

	const removeSelectedNode = useCallback((nodeId: string) => {
		setSelectedNodeIds((prev) => prev.filter((id) => id !== nodeId));
	}, []);

	const clearSelection = useCallback(() => {
		setSelectedNodeIds([]);
		setFocusedNodeId(null);
	}, []);

	const selectNode = useCallback(
		(nodeId: string) => {
			setFocusedNodeId(nodeId);
			addSelectedNode(nodeId);
		},
		[addSelectedNode],
	);

	return {
		selectedNodeIds,
		selectedNodes,
		focusedNodeId,
		focusedNode,
		selectedRelationships,
		connectedNodes,
		addSelectedNode,
		removeSelectedNode,
		clearSelection,
		selectNode,
		setFocusedNodeId,
	};
}

export default useGraphData;
