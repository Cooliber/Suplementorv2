/**
 * Global Loading Component
 * Displays while pages are loading
 */

import { SkeletonCard } from "@/components/loading/SkeletonCard";

export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<div className="container mx-auto px-4 py-16">
				<div className="mb-12 space-y-4">
					<div className="h-12 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
					<div className="h-6 w-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<SkeletonCard />
					<SkeletonCard />
					<SkeletonCard />
					<SkeletonCard />
					<SkeletonCard />
					<SkeletonCard />
				</div>
			</div>
		</div>
	);
}
