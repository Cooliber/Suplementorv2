"use client";

import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import {
	Award,
	Clock,
	Pill,
	Shield,
	ShoppingCart,
	Star,
	ThumbsDown,
	ThumbsUp,
	TrendingUp,
} from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ReviewWithUser } from "@/types/review";

interface ReviewCardProps {
	review: ReviewWithUser;
	showSupplement?: boolean;
	showUser?: boolean;
	compact?: boolean;
	onHelpful?: (reviewId: string, helpful: boolean) => void;
	className?: string;
}

export function ReviewCard({
	review,
	showSupplement = false,
	showUser = true,
	compact = false,
	onHelpful,
	className,
}: ReviewCardProps) {
	const [isVoting, setIsVoting] = React.useState(false);
	const [isExpanded, setIsExpanded] = React.useState(false);

	// Generate user initials for avatar
	const getUserInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	// Handle helpful/not helpful votes
	const handleVote = async (helpful: boolean) => {
		if (isVoting || !onHelpful) return;

		setIsVoting(true);
		try {
			await onHelpful(review.id, helpful);
		} finally {
			setIsVoting(false);
		}
	};

	// Format date in Polish locale
	const formatDate = (dateString: string) => {
		try {
			return formatDistanceToNow(new Date(dateString), {
				addSuffix: true,
				locale: pl,
			});
		} catch {
			return new Date(dateString).toLocaleDateString("pl-PL");
		}
	};

	// Render enhanced star rating with animations
	const renderStars = (
		rating: number,
		size: "sm" | "md" = "sm",
		interactive = false,
	) => {
		const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

		return (
			<div className="flex items-center gap-1">
				{Array.from({ length: 5 }, (_, i) => (
					<div key={i} className="relative">
						<Star
							className={cn(
								starSize,
								"transition-all duration-200",
								i < rating
									? "fill-yellow-400 text-yellow-400"
									: "text-gray-300",
								interactive && "cursor-pointer hover:scale-110",
							)}
						/>
						{interactive && (
							<Star
								className={cn(
									starSize,
									"absolute top-0 left-0 transition-all duration-200",
									i < rating
										? "fill-yellow-400 text-yellow-400"
										: "text-gray-300 hover:text-yellow-200",
								)}
							/>
						)}
					</div>
				))}
				<span className="ml-2 font-medium text-sm">{rating}/5</span>
			</div>
		);
	};

	// Render enhanced pros and cons with better styling
	const renderProsCons = () => {
		if ((!review.pros.length && !review.cons.length) || compact) return null;

		return (
			<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
				{review.pros.length > 0 && (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<TrendingUp className="h-4 w-4 text-green-600" />
							<h4 className="font-semibold text-green-700 text-sm">
								Zalety ({review.pros.length})
							</h4>
						</div>
						<div className="space-y-2">
							{review.pros.map((pro, index) => (
								<div
									key={index}
									className="flex items-start gap-2 rounded-lg border border-green-100 bg-green-50 p-2"
								>
									<div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
									<span className="text-green-700 text-sm leading-relaxed">
										{pro}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{review.cons.length > 0 && (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<TrendingUp className="h-4 w-4 rotate-180 text-red-600" />
							<h4 className="font-semibold text-red-700 text-sm">
								Wady ({review.cons.length})
							</h4>
						</div>
						<div className="space-y-2">
							{review.cons.map((con, index) => (
								<div
									key={index}
									className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-2"
								>
									<div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
									<span className="text-red-700 text-sm leading-relaxed">
										{con}
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		);
	};

	// Render detailed ratings with progress bars
	const renderDetailedRatings = () => {
		if (!review.effectiveness && !review.valueForMoney && !review.easeOfUse)
			return null;

		const ratings = [
			{
				key: "effectiveness",
				label: "Skuteczność",
				value: review.effectiveness,
				icon: Award,
				color: "blue",
			},
			{
				key: "valueForMoney",
				label: "Stosunek jakość/cena",
				value: review.valueForMoney,
				icon: ShoppingCart,
				color: "green",
			},
			{
				key: "easeOfUse",
				label: "Łatwość stosowania",
				value: review.easeOfUse,
				icon: Pill,
				color: "purple",
			},
		].filter((r) => r.value);

		return (
			<div className="mt-6 rounded-lg border bg-gradient-to-r from-slate-50 to-slate-100 p-4">
				<h4 className="mb-4 flex items-center gap-2 font-semibold text-sm">
					<Award className="h-4 w-4" />
					Szczegółowe oceny
				</h4>
				<div className="space-y-3">
					{ratings.map((rating) => {
						const Icon = rating.icon;
						const percentage = (rating.value! / 5) * 100;

						return (
							<div key={rating.key} className="space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Icon
											className={cn("h-4 w-4", {
												"text-blue-600": rating.color === "blue",
												"text-green-600": rating.color === "green",
												"text-purple-600": rating.color === "purple",
											})}
										/>
										<span className="font-medium text-sm">{rating.label}</span>
									</div>
									<span className="text-muted-foreground text-sm">
										{rating.value}/5
									</span>
								</div>
								<Progress
									value={percentage}
									className={cn("h-2", {
										"[&>div]:bg-blue-500": rating.color === "blue",
										"[&>div]:bg-green-500": rating.color === "green",
										"[&>div]:bg-purple-500": rating.color === "purple",
									})}
								/>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<TooltipProvider>
			<Card
				className={cn(
					"w-full border-l-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
					review.verifiedPurchase ? "border-l-green-500" : "border-l-blue-500",
					className,
				)}
			>
				<CardHeader className={cn("pb-4", compact && "pb-3")}>
					<div className="flex items-start justify-between gap-4">
						<div className="flex flex-1 items-start space-x-4">
							{showUser && (
								<div className="flex flex-col items-center space-y-2">
									<Avatar className="h-10 w-10 ring-2 ring-primary/10">
										<AvatarImage src={review.user?.image} />
										<AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 font-semibold text-sm">
											{getUserInitials(review.user?.name)}
										</AvatarFallback>
									</Avatar>
									{review.verifiedUser && (
										<Tooltip>
											<TooltipTrigger>
												<Shield className="h-4 w-4 text-blue-600" />
											</TooltipTrigger>
											<TooltipContent>
												<p>Użytkownik zweryfikowany</p>
											</TooltipContent>
										</Tooltip>
									)}
								</div>
							)}

							<div className="min-w-0 flex-1">
								<div className="mb-2 flex items-center gap-3">
									{showUser && (
										<div className="flex items-center gap-2">
											<span className="font-semibold text-base">
												{review.user?.name || "Użytkownik"}
											</span>
											{review.verifiedPurchase && (
												<Tooltip>
													<TooltipTrigger>
														<Badge
															variant="secondary"
															className="bg-green-100 text-green-800 text-xs hover:bg-green-200"
														>
															<ShoppingCart className="mr-1 h-3 w-3" />
															Zakup potwierdzony
														</Badge>
													</TooltipTrigger>
													<TooltipContent>
														<p>Opinia od zweryfikowanego kupującego</p>
													</TooltipContent>
												</Tooltip>
											)}
										</div>
									)}

									<div className="flex items-center gap-2">
										<div className="flex items-center gap-1 rounded-full border bg-yellow-50 px-2 py-1">
											{renderStars(review.rating, "sm")}
										</div>
									</div>
								</div>

								<div className="mb-3 flex items-center gap-3 text-muted-foreground text-sm">
									<div className="flex items-center gap-1">
										<Clock className="h-3 w-3" />
										<span>{formatDate(review.createdAt)}</span>
									</div>
									{review.dosage && (
										<>
											<Separator orientation="vertical" className="h-4" />
											<div className="flex items-center gap-1">
												<Pill className="h-3 w-3" />
												<span>Dawka: {review.dosage}</span>
											</div>
										</>
									)}
									{review.duration && (
										<>
											<Separator orientation="vertical" className="h-4" />
											<div className="flex items-center gap-1">
												<Clock className="h-3 w-3" />
												<span>Czas: {review.duration}</span>
											</div>
										</>
									)}
								</div>

								{review.title && (
									<h3 className="mb-3 font-bold text-lg leading-tight">
										{review.title}
									</h3>
								)}
							</div>
						</div>

						{!compact && onHelpful && (
							<div className="flex items-center gap-1">
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleVote(true)}
											disabled={isVoting}
											className="h-9 px-3 transition-colors hover:bg-green-50 hover:text-green-700"
										>
											<ThumbsUp
												className={cn(
													"mr-2 h-4 w-4",
													isVoting && "animate-pulse",
												)}
											/>
											{review.helpful}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Pomocna opinia</p>
									</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleVote(false)}
											disabled={isVoting}
											className="h-9 px-3 transition-colors hover:bg-red-50 hover:text-red-700"
										>
											<ThumbsDown
												className={cn(
													"mr-2 h-4 w-4",
													isVoting && "animate-pulse",
												)}
											/>
											{review.notHelpful}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Niepomocna opinia</p>
									</TooltipContent>
								</Tooltip>
							</div>
						)}
					</div>
				</CardHeader>

				<CardContent className={cn("pt-0", compact && "px-6")}>
					{/* Review content */}
					<div className="mb-4">
						<p
							className={cn(
								"text-base text-foreground leading-relaxed",
								compact && !isExpanded && "line-clamp-3",
								!compact && "whitespace-pre-wrap",
							)}
						>
							{review.content}
						</p>

						{compact && review.content.length > 150 && (
							<Button
								variant="link"
								size="sm"
								onClick={() => setIsExpanded(!isExpanded)}
								className="h-auto p-0 text-primary hover:text-primary/80"
							>
								{isExpanded ? "Pokaż mniej" : "Pokaż więcej"}
							</Button>
						)}
					</div>

					{/* Pros and cons */}
					{renderProsCons()}

					{/* Detailed ratings */}
					{!compact && renderDetailedRatings()}
				</CardContent>
			</Card>
		</TooltipProvider>
	);
}
