"use client";

import { Filter, SortAsc, SortDesc, Star } from "lucide-react";
import * as React from "react";

import { SkeletonReviewList } from "@/components/loading/SkeletonCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
	ReviewFilters,
	ReviewStats,
	ReviewWithUser,
} from "@/types/review";
import { ReviewCard } from "./ReviewCard";

interface ReviewListProps {
	reviews: ReviewWithUser[];
	stats?: ReviewStats;
	totalCount: number;
	averageRating: number;
	isLoading?: boolean;
	error?: string | null;
	hasNextPage?: boolean;
	hasPrevPage?: boolean;
	currentPage?: number;
	onPageChange?: (page: number) => void;
	onFilterChange?: (filters: ReviewFilters) => void;
	onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
	onHelpful?: (reviewId: string, helpful: boolean) => void;
	showStats?: boolean;
	emptyMessage?: string;
	className?: string;
}

export function ReviewList({
	reviews,
	stats,
	totalCount,
	averageRating,
	isLoading = false,
	error = null,
	hasNextPage = false,
	hasPrevPage = false,
	currentPage = 1,
	onPageChange,
	onFilterChange,
	onSortChange,
	onHelpful,
	showStats = true,
	emptyMessage = "Brak opinii dla tego suplementu.",
	className,
}: ReviewListProps) {
	const [sortBy, setSortBy] = React.useState("createdAt");
	const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
	const [showFilters, setShowFilters] = React.useState(false);

	// Handle sort change
	const handleSortChange = (newSortBy: string) => {
		const newSortOrder =
			sortBy === newSortBy && sortOrder === "desc" ? "asc" : "desc";
		setSortBy(newSortBy);
		setSortOrder(newSortOrder);
		onSortChange?.(newSortBy, newSortOrder);
	};

	// Render loading skeletons
	const renderLoadingSkeletons = () => {
		return <SkeletonReviewList count={3} />;
	};

	// Render review statistics
	const renderStats = () => {
		if (!showStats || !stats) return null;

		return (
			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
						Oceny i opinie ({totalCount})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
						{/* Average rating */}
						<div className="text-center">
							<div className="font-bold text-3xl text-primary">
								{averageRating.toFixed(1)}
							</div>
							<div className="mt-1 flex items-center justify-center gap-1">
								{Array.from({ length: 5 }, (_, i) => (
									<Star
										key={i}
										className={cn(
											"h-4 w-4",
											i < Math.floor(averageRating)
												? "fill-yellow-400 text-yellow-400"
												: "text-gray-300",
										)}
									/>
								))}
							</div>
							<div className="mt-1 text-muted-foreground text-sm">
								Średnia ocena
							</div>
						</div>

						{/* Total reviews */}
						<div className="text-center">
							<div className="font-bold text-3xl">{totalCount}</div>
							<div className="mt-1 text-muted-foreground text-sm">
								Łącznie opinii
							</div>
						</div>

						{/* Rating distribution */}
						<div className="col-span-2">
							<div className="space-y-2">
								{[5, 4, 3, 2, 1].map((rating) => {
									const count =
										stats.distribution[
											rating as keyof typeof stats.distribution
										];
									const percentage =
										totalCount > 0 ? (count / totalCount) * 100 : 0;

									return (
										<div
											key={rating}
											className="flex items-center gap-2 text-sm"
										>
											<span className="w-8">{rating}★</span>
											<div className="h-2 flex-1 rounded-full bg-gray-200">
												<div
													className="h-2 rounded-full bg-yellow-400"
													style={{ width: `${percentage}%` }}
												/>
											</div>
											<span className="w-8 text-right">{count}</span>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	};

	// Render sort and filter controls
	const renderControls = () => {
		return (
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setShowFilters(!showFilters)}
					>
						<Filter className="mr-2 h-4 w-4" />
						Filtry
					</Button>

					<Select value={sortBy} onValueChange={handleSortChange}>
						<SelectTrigger className="w-48">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="createdAt">
								Najnowsze{" "}
								{sortBy === "createdAt" && (sortOrder === "desc" ? "↓" : "↑")}
							</SelectItem>
							<SelectItem value="rating">
								Ocena{" "}
								{sortBy === "rating" && (sortOrder === "desc" ? "↓" : "↑")}
							</SelectItem>
							<SelectItem value="helpful">
								Najbardziej pomocne{" "}
								{sortBy === "helpful" && (sortOrder === "desc" ? "↓" : "↑")}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="text-muted-foreground text-sm">
					{totalCount} opin
					{totalCount === 1 ? "ia" : totalCount < 5 ? "ie" : "ii"}
				</div>
			</div>
		);
	};

	// Render pagination
	const renderPagination = () => {
		if (totalCount === 0 || (!hasNextPage && !hasPrevPage)) return null;

		return (
			<div className="mt-6 flex items-center justify-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange?.(currentPage - 1)}
					disabled={!hasPrevPage || isLoading}
				>
					Poprzednia
				</Button>

				<div className="flex items-center gap-1">
					{Array.from(
						{ length: Math.min(5, Math.ceil(totalCount / 10)) },
						(_, i) => {
							const page = currentPage - 2 + i;
							if (page < 1 || page > Math.ceil(totalCount / 10)) return null;

							return (
								<Button
									key={page}
									variant={page === currentPage ? "default" : "outline"}
									size="sm"
									onClick={() => onPageChange?.(page)}
									disabled={isLoading}
								>
									{page}
								</Button>
							);
						},
					)}
				</div>

				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange?.(currentPage + 1)}
					disabled={!hasNextPage || isLoading}
				>
					Następna
				</Button>
			</div>
		);
	};

	// Handle error state
	if (error) {
		return (
			<Alert className={cn("w-full", className)}>
				<AlertDescription>
					Wystąpił błąd podczas ładowania opinii: {error}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className={cn("w-full space-y-4", className)}>
			{/* Statistics */}
			{renderStats()}

			{/* Controls */}
			{renderControls()}

			{/* Reviews list */}
			<div className="space-y-4">
				{isLoading ? (
					renderLoadingSkeletons()
				) : reviews.length > 0 ? (
					reviews.map((review) => (
						<ReviewCard key={review.id} review={review} onHelpful={onHelpful} />
					))
				) : (
					<Card>
						<CardContent className="py-8 text-center">
							<p className="text-muted-foreground">{emptyMessage}</p>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Pagination */}
			{renderPagination()}
		</div>
	);
}
