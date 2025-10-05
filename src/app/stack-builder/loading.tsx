/**
 * Stack Builder Loading Component
 */

import { SkeletonCard } from "@/components/loading/SkeletonCard";

export default function StackBuilderLoading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<div className="container mx-auto px-4 py-16">
				<div className="mb-8 space-y-4">
					<div className="h-12 w-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
					<div className="h-6 w-full max-w-2xl animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
				</div>
				<div className="grid gap-8 lg:grid-cols-2">
					<div className="space-y-4">
						<div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
					</div>
					<div className="space-y-4">
						<div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
						<SkeletonCard />
						<SkeletonCard />
					</div>
				</div>
			</div>
		</div>
	);
}
