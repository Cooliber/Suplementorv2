"use client";

import type { BodySystem } from "@/data/body-systems";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { BodySystemCard } from "./BodySystemCard";

interface BodySystemsLazyLoaderProps {
	systems: BodySystem[];
	itemsPerPage?: number;
	onSupplementClick?: (supplementId: string) => void;
	compact?: boolean;
	showRelatedSupplements?: boolean;
}

export function BodySystemsLazyLoader({
	systems,
	itemsPerPage = 9,
	onSupplementClick,
	compact = false,
	showRelatedSupplements = true,
}: BodySystemsLazyLoaderProps) {
	const [visibleCount, setVisibleCount] = useState(itemsPerPage);
	const [isLoading, setIsLoading] = useState(false);
	const loadMoreRef = useRef<HTMLDivElement>(null);

	// Intersection Observer for infinite scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && visibleCount < systems.length) {
					setIsLoading(true);
					// Simulate loading delay for smooth UX
					setTimeout(() => {
						setVisibleCount((prev) =>
							Math.min(prev + itemsPerPage, systems.length),
						);
						setIsLoading(false);
					}, 300);
				}
			},
			{ threshold: 0.1 },
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => observer.disconnect();
	}, [visibleCount, systems.length, itemsPerPage]);

	// Visible systems based on current count
	const visibleSystems = useMemo(() => {
		return systems.slice(0, visibleCount);
	}, [systems, visibleCount]);

	// Check if there are more items to load
	const hasMore = visibleCount < systems.length;

	// Loading skeleton component
	const LoadingSkeleton = () => (
		<div className={`animate-pulse ${compact ? "space-y-3" : "space-y-4"}`}>
			<div className={`rounded-lg bg-gray-200 ${compact ? "h-32" : "h-48"}`} />
			<div className="space-y-2">
				<div className="h-4 w-3/4 rounded bg-gray-200" />
				<div className="h-4 w-1/2 rounded bg-gray-200" />
			</div>
		</div>
	);

	return (
		<div className="space-y-6">
			{/* Visible systems grid/list */}
			<div
				className={
					!compact
						? "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3"
						: "space-y-3 md:space-y-4"
				}
			>
				{visibleSystems.map((system) => (
					<BodySystemCard
						key={system.id}
						system={system}
						onSupplementClick={onSupplementClick}
						compact={compact}
						showRelatedSupplements={showRelatedSupplements}
					/>
				))}
			</div>

			{/* Loading skeletons for next batch */}
			{isLoading && (
				<div
					className={
						!compact
							? "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3"
							: "space-y-3 md:space-y-4"
					}
				>
					{Array.from({
						length: Math.min(itemsPerPage, systems.length - visibleCount),
					}).map((_, index) => (
						<LoadingSkeleton key={`skeleton-${index}`} />
					))}
				</div>
			)}

			{/* Load more trigger */}
			{hasMore && !isLoading && (
				<div ref={loadMoreRef} className="flex justify-center py-8">
					<div className="text-gray-500 text-sm">
						Przewiń w dół, aby załadować więcej układów ciała...
					</div>
				</div>
			)}

			{/* End of content indicator */}
			{!hasMore && visibleSystems.length > 0 && (
				<div className="py-8 text-center">
					<div className="text-gray-500 text-sm">
						Wyświetlono wszystkie dostępne układy ciała ({systems.length})
					</div>
				</div>
			)}
		</div>
	);
}

// Hook for progressive loading with time-based slicing
export function useProgressiveLoading<T>(
	items: T[],
	initialCount = 6,
	increment = 3,
	delay = 100,
) {
	const [visibleCount, setVisibleCount] = useState(initialCount);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (visibleCount >= items.length) return;

		const timer = setTimeout(() => {
			setIsLoading(true);
			setTimeout(() => {
				setVisibleCount((prev) => Math.min(prev + increment, items.length));
				setIsLoading(false);
			}, delay);
		}, 2000); // Load more after 2 seconds of no interaction

		return () => clearTimeout(timer);
	}, [visibleCount, items.length, increment, delay]);

	return {
		visibleItems: items.slice(0, visibleCount),
		hasMore: visibleCount < items.length,
		isLoading,
		loadMore: () =>
			setVisibleCount((prev) => Math.min(prev + increment, items.length)),
	};
}
