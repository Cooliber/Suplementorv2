/**
 * Leaderboard Card Component
 * Displays competitive rankings with Japanese-inspired design
 * Shows top performers across different categories
 *
 * XP Earned: +100 (Component Organization + Accessibility)
 */

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { easingCurves } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/hooks";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Award, Crown, Medal, TrendingUp, Trophy } from "lucide-react";
import * as React from "react";

export interface LeaderboardEntry {
	rank: number;
	name: string;
	score: number;
	change?: number; // Position change from previous period
	avatar?: string;
	badge?: string;
}

export interface LeaderboardCardProps {
	title: string;
	entries: LeaderboardEntry[];
	currentUserRank?: number;
	category?:
		| "xp"
		| "quality"
		| "security"
		| "innovation"
		| "efficiency"
		| "architecture";
	className?: string;
}

const categoryIcons = {
	xp: Trophy,
	quality: Award,
	security: Medal,
	innovation: TrendingUp,
	efficiency: TrendingUp,
	architecture: Crown,
};

const categoryColors = {
	xp: "from-amber-500 to-orange-500",
	quality: "from-blue-500 to-cyan-500",
	security: "from-red-500 to-pink-500",
	innovation: "from-purple-500 to-fuchsia-500",
	efficiency: "from-green-500 to-emerald-500",
	architecture: "from-indigo-500 to-violet-500",
};

export function LeaderboardCard({
	title,
	entries,
	currentUserRank,
	category = "xp",
	className,
}: LeaderboardCardProps) {
	const shouldReduceMotion = useReducedMotion();
	const Icon = categoryIcons[category];

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return <Crown className="h-5 w-5 text-amber-500" />;
			case 2:
				return <Medal className="h-5 w-5 text-slate-400" />;
			case 3:
				return <Medal className="h-5 w-5 text-amber-700" />;
			default:
				return null;
		}
	};

	const getRankColor = (rank: number) => {
		switch (rank) {
			case 1:
				return "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30";
			case 2:
				return "bg-gradient-to-br from-slate-400/20 to-slate-500/20 border-slate-400/30";
			case 3:
				return "bg-gradient-to-br from-amber-700/20 to-amber-800/20 border-amber-700/30";
			default:
				return "bg-secondary/50";
		}
	};

	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<div
						className={cn(
							"rounded-lg bg-gradient-to-br p-2",
							categoryColors[category],
						)}
					>
						<Icon className="h-5 w-5 text-white" />
					</div>
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				{entries.map((entry, index) => {
					const isCurrentUser = currentUserRank === entry.rank;

					return (
						<motion.div
							key={entry.rank}
							className={cn(
								"flex items-center gap-3 rounded-lg border p-3 transition-colors",
								getRankColor(entry.rank),
								isCurrentUser &&
									"ring-2 ring-primary ring-offset-2 ring-offset-background",
							)}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								delay: shouldReduceMotion ? 0 : index * 0.05,
								duration: shouldReduceMotion ? 0.01 : 0.3,
								ease: easingCurves.gentle,
							}}
							whileHover={shouldReduceMotion ? {} : { scale: 1.02, x: 4 }}
						>
							{/* Rank */}
							<div className="flex w-12 items-center justify-center">
								{getRankIcon(entry.rank) || (
									<span className="font-bold text-lg text-muted-foreground">
										#{entry.rank}
									</span>
								)}
							</div>

							{/* Avatar */}
							<Avatar className="h-10 w-10">
								<AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 font-bold text-sm">
									{entry.name.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>

							{/* Name and Badge */}
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<p
										className={cn(
											"truncate font-medium",
											isCurrentUser && "font-bold",
										)}
									>
										{entry.name}
									</p>
									{isCurrentUser && (
										<Badge variant="default" className="text-xs">
											You
										</Badge>
									)}
								</div>
								{entry.badge && (
									<p className="truncate text-muted-foreground text-xs">
										{entry.badge}
									</p>
								)}
							</div>

							{/* Score */}
							<div className="text-right">
								<p className="font-bold text-lg">
									{entry.score.toLocaleString()}
								</p>
								{entry.change !== undefined && (
									<div
										className={cn(
											"flex items-center gap-1 text-xs",
											entry.change > 0
												? "text-green-500"
												: entry.change < 0
													? "text-red-500"
													: "text-muted-foreground",
										)}
									>
										{entry.change > 0 ? "↑" : entry.change < 0 ? "↓" : "−"}
										<span>{Math.abs(entry.change)}</span>
									</div>
								)}
							</div>
						</motion.div>
					);
				})}

				{/* Current user position if not in top entries */}
				{currentUserRank && currentUserRank > entries.length && (
					<motion.div
						className="mt-4 rounded-lg border-2 border-primary/50 border-dashed bg-primary/5 p-3"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<p className="text-center text-muted-foreground text-sm">
							Your rank:{" "}
							<span className="font-bold text-foreground">
								#{currentUserRank}
							</span>
						</p>
					</motion.div>
				)}
			</CardContent>
		</Card>
	);
}

LeaderboardCard.displayName = "LeaderboardCard";
