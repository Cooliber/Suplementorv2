"use client";

/**
 * Skeleton Loading Components - Polish Accessibility
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonCard() {
	return (
		<Card>
			<CardHeader>
				<div className="mb-4 h-12 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
				<div className="space-y-2">
					<div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					<div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					<div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					<div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					<div className="h-4 w-4/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
				</div>
			</CardContent>
		</Card>
	);
}

export function SkeletonSupplementCard() {
	return (
		<Card>
			<CardHeader>
				<div className="mb-4 flex items-center justify-between">
					<div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
					<div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
				</div>
				<div className="space-y-2">
					<div className="h-6 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					<div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="space-y-2">
						<div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						<div className="flex gap-2">
							<div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
							<div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
							<div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
						</div>
					</div>
					<div className="space-y-2">
						<div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						<div className="space-y-1">
							<div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
							<div className="h-3 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
							<div className="h-3 w-4/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						</div>
					</div>
					<div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
				</div>
			</CardContent>
		</Card>
	);
}

export function SkeletonList({ count = 3 }: { count?: number }) {
	return (
		<div className="space-y-4">
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="flex items-center gap-4">
					<div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
					<div className="flex-1 space-y-2">
						<div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
						<div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
					</div>
				</div>
			))}
		</div>
	);
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: count }).map((_, i) => (
				<SkeletonSupplementCard key={i} />
			))}
		</div>
	);
}
