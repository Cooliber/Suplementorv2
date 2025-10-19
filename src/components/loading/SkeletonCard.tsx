"use client";

/**
 * Skeleton Loading Components - Polish Accessibility
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

// Form Skeletons
export function SkeletonForm() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-10 w-full" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-32 w-full" />
			</div>
			<div className="flex gap-2">
				<Skeleton className="h-6 w-16" />
				<Skeleton className="h-6 w-16" />
			</div>
		</div>
	);
}

export function SkeletonReviewForm() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-48" />
				<Skeleton className="h-4 w-64" />
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Skeleton className="h-4 w-20" />
						<div className="flex gap-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className="h-8 w-8 rounded-full" />
							))}
						</div>
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<div className="flex gap-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className="h-8 w-8 rounded-full" />
							))}
						</div>
					</div>
				</div>
				<div className="space-y-2">
					<Skeleton className="h-4 w-28" />
					<Skeleton className="h-20 w-full" />
				</div>
				<div className="space-y-2">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-20 w-full" />
				</div>
				<Skeleton className="h-10 w-24" />
			</CardContent>
		</Card>
	);
}

// Table Skeletons
export function SkeletonTable({
	rows = 5,
	columns = 4,
}: { rows?: number; columns?: number }) {
	return (
		<div className="space-y-3">
			{/* Header */}
			<div className="flex gap-4">
				{Array.from({ length: columns }).map((_, i) => (
					<Skeleton key={i} className="h-6 flex-1" />
				))}
			</div>
			{/* Rows */}
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<div key={rowIndex} className="flex gap-4">
					{Array.from({ length: columns }).map((_, colIndex) => (
						<Skeleton key={colIndex} className="h-4 flex-1" />
					))}
				</div>
			))}
		</div>
	);
}

export function SkeletonDataTable() {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-8 w-24" />
				</div>
			</CardHeader>
			<CardContent>
				<SkeletonTable rows={8} columns={5} />
			</CardContent>
		</Card>
	);
}

// Chart Skeletons
export function SkeletonChart() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-48" />
				<Skeleton className="h-4 w-64" />
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex justify-between">
						{Array.from({ length: 6 }).map((_, i) => (
							<Skeleton key={i} className="h-4 w-12" />
						))}
					</div>
					<div className="space-y-2">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="flex items-end gap-2">
								{Array.from({ length: 6 }).map((_, j) => (
									<Skeleton
										key={j}
										className={`w-full ${
											i === 0
												? "h-32"
												: i === 1
													? "h-24"
													: i === 2
														? "h-16"
														: "h-8"
										}`}
									/>
								))}
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function SkeletonPieChart() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-40" />
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-8">
					<div className="relative">
						<Skeleton className="h-48 w-48 rounded-full" />
						<div className="absolute inset-0 flex items-center justify-center">
							<Skeleton className="h-20 w-20 rounded-full" />
						</div>
					</div>
					<div className="flex-1 space-y-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="flex items-center gap-3">
								<Skeleton className="h-4 w-4 rounded-full" />
								<div className="flex-1">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="mt-1 h-3 w-16" />
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Review Skeletons
export function SkeletonReviewCard() {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded-full" />
							<div>
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-3 w-24" />
							</div>
						</div>
					</div>
					<div className="flex gap-1">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-4 w-4" />
						))}
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
				<Skeleton className="h-4 w-4/6" />
				<div className="flex items-center gap-4 pt-2">
					<Skeleton className="h-6 w-16" />
					<Skeleton className="h-6 w-20" />
				</div>
			</CardContent>
		</Card>
	);
}

export function SkeletonReviewList({ count = 3 }: { count?: number }) {
	return (
		<div className="space-y-4">
			{Array.from({ length: count }).map((_, i) => (
				<SkeletonReviewCard key={i} />
			))}
		</div>
	);
}

// Dosage Calculator Skeletons
export function SkeletonDosageCalculator() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-7 w-56" />
				<Skeleton className="h-4 w-80" />
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Step 1: Supplement Selection */}
				<div className="space-y-3">
					<Skeleton className="h-5 w-40" />
					<Skeleton className="h-10 w-full" />
				</div>

				{/* Step 2: User Info */}
				<div className="space-y-3">
					<Skeleton className="h-5 w-32" />
					<div className="grid grid-cols-2 gap-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				</div>

				{/* Step 3: Health Conditions */}
				<div className="space-y-3">
					<Skeleton className="h-5 w-36" />
					<div className="space-y-2">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex items-center gap-2">
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-4 flex-1" />
							</div>
						))}
					</div>
				</div>

				{/* Calculate Button */}
				<Skeleton className="h-10 w-32" />
			</CardContent>
		</Card>
	);
}

export function SkeletonDosageResult() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-48" />
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-3 rounded-lg border p-4">
					<Skeleton className="h-5 w-32" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-6 w-16" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-6 w-20" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Progressive Loading Skeletons
export function SkeletonProgressiveLoader({ steps = 3 }: { steps?: number }) {
	return (
		<div className="space-y-4">
			{Array.from({ length: steps }).map((_, i) => (
				<div key={i} className="flex items-center gap-3">
					<Skeleton className="h-6 w-6 rounded-full" />
					<div className="flex-1">
						<Skeleton className="h-4 w-48" />
						<Skeleton className="mt-1 h-3 w-32" />
					</div>
					{i === 0 && <Skeleton className="h-4 w-16" />}
				</div>
			))}
		</div>
	);
}

export function SkeletonLoadingOverlay() {
	return (
		<div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
			<Card className="p-6">
				<div className="flex items-center gap-3">
					<Skeleton className="h-6 w-6 animate-spin rounded-full" />
					<Skeleton className="h-4 w-32" />
				</div>
			</Card>
		</div>
	);
}

// Text Content Skeletons
export function SkeletonText({ lines = 3 }: { lines?: number }) {
	return (
		<div className="space-y-2">
			{Array.from({ length: lines }).map((_, i) => (
				<Skeleton
					key={i}
					className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
				/>
			))}
		</div>
	);
}

export function SkeletonTitle() {
	return (
		<div className="space-y-3">
			<Skeleton className="h-8 w-64" />
			<Skeleton className="h-4 w-48" />
		</div>
	);
}

// Dashboard Skeletons
export function SkeletonDashboard() {
	return (
		<div className="space-y-6">
			<SkeletonTitle />
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardHeader className="pb-2">
							<Skeleton className="h-4 w-24" />
						</CardHeader>
						<CardContent>
							<Skeleton className="mb-2 h-8 w-16" />
							<Skeleton className="h-3 w-32" />
						</CardContent>
					</Card>
				))}
			</div>
			<div className="grid gap-6 lg:grid-cols-2">
				<SkeletonChart />
				<SkeletonDataTable />
			</div>
		</div>
	);
}

// Advanced Progressive Loading Component
export function SkeletonProgressiveGrid({
	itemsPerBatch = 6,
	totalBatches = 3,
	showBatchInfo = true,
}: {
	itemsPerBatch?: number;
	totalBatches?: number;
	showBatchInfo?: boolean;
}) {
	return (
		<div className="space-y-6">
			{showBatchInfo && (
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-48" />
					<Skeleton className="h-4 w-32" />
				</div>
			)}

			{Array.from({ length: totalBatches }).map((_, batchIndex) => (
				<div key={batchIndex} className="space-y-4">
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-4 rounded-full" />
						<Skeleton className="h-4 w-32" />
						{batchIndex === 0 && (
							<Skeleton className="ml-auto h-6 w-16 rounded-full" />
						)}
					</div>

					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: itemsPerBatch }).map((_, itemIndex) => (
							<SkeletonSupplementCard key={itemIndex} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}

// Infinite Scroll Loading Indicator
export function SkeletonInfiniteLoader() {
	return (
		<div className="flex items-center justify-center py-8">
			<div className="flex items-center gap-3">
				<div className="flex gap-1">
					<Skeleton className="h-2 w-2 animate-bounce rounded-full" />
					<Skeleton
						className="h-2 w-2 animate-bounce rounded-full"
						style={{ animationDelay: "0.1s" }}
					/>
					<Skeleton
						className="h-2 w-2 animate-bounce rounded-full"
						style={{ animationDelay: "0.2s" }}
					/>
				</div>
				<Skeleton className="h-4 w-24" />
			</div>
		</div>
	);
}

// Data Loading States
export function SkeletonDataLoadingState({
	type = "table",
	rows = 5,
	showProgress = true,
}: {
	type?: "table" | "cards" | "list";
	rows?: number;
	showProgress?: boolean;
}) {
	return (
		<div className="space-y-4">
			{showProgress && (
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-40" />
					<div className="flex items-center gap-2">
						<Skeleton className="h-2 w-24 rounded-full" />
						<Skeleton className="h-4 w-12" />
					</div>
				</div>
			)}

			{type === "table" && <SkeletonDataTable />}
			{type === "cards" && <SkeletonGrid count={rows * 2} />}
			{type === "list" && <SkeletonList count={rows} />}
		</div>
	);
}
