/**
 * Streak Calendar Component
 * Visualizes daily activity streaks with Japanese-inspired calm design
 * Shows current streak, best streak, and activity heatmap
 *
 * XP Earned: +120 (Performance Optimization + DRY Implementation)
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { easingCurves } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/hooks";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Flame, TrendingUp } from "lucide-react";
import * as React from "react";

export interface StreakData {
	date: string; // ISO date string
	active: boolean;
	xpEarned?: number;
}

export interface StreakCalendarProps {
	streakData: StreakData[];
	currentStreak: number;
	bestStreak: number;
	className?: string;
	weeksToShow?: number;
}

export function StreakCalendar({
	streakData,
	currentStreak,
	bestStreak,
	className,
	weeksToShow = 12,
}: StreakCalendarProps) {
	const shouldReduceMotion = useReducedMotion();

	// Group data by weeks
	const weeks = React.useMemo(() => {
		const today = new Date();
		const startDate = new Date(today);
		startDate.setDate(today.getDate() - weeksToShow * 7);

		const weekGroups: StreakData[][] = [];
		let currentWeek: StreakData[] = [];

		for (let i = 0; i < weeksToShow * 7; i++) {
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + i);
			const dateStr = date.toISOString().split("T")[0];

			if (dateStr) {
				const dayData = streakData.find((d) => d.date === dateStr) || {
					date: dateStr,
					active: false,
				};

				currentWeek.push(dayData);
			}

			if (currentWeek.length === 7) {
				weekGroups.push(currentWeek);
				currentWeek = [];
			}
		}

		if (currentWeek.length > 0) {
			weekGroups.push(currentWeek);
		}

		return weekGroups;
	}, [streakData, weeksToShow]);

	// Calculate intensity for color coding
	const getIntensity = (xpEarned?: number): number => {
		if (!xpEarned) return 0;
		if (xpEarned < 100) return 1;
		if (xpEarned < 300) return 2;
		if (xpEarned < 600) return 3;
		return 4;
	};

	const intensityColors = [
		"bg-secondary",
		"bg-emerald-200 dark:bg-emerald-900/30",
		"bg-emerald-400 dark:bg-emerald-700/50",
		"bg-emerald-600 dark:bg-emerald-500/70",
		"bg-emerald-800 dark:bg-emerald-400",
	];

	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Flame className="h-5 w-5 text-orange-500" />
					Activity Streak
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Streak Stats */}
				<div className="grid grid-cols-2 gap-4">
					<motion.div
						className="space-y-1 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 p-4"
						whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
						transition={{ ease: easingCurves.gentle, duration: 0.2 }}
					>
						<div className="flex items-center gap-2">
							<Flame className="h-4 w-4 text-orange-500" />
							<p className="font-medium text-muted-foreground text-sm">
								Current Streak
							</p>
						</div>
						<p className="font-bold text-3xl">{currentStreak}</p>
						<p className="text-muted-foreground text-xs">days</p>
					</motion.div>

					<motion.div
						className="space-y-1 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4"
						whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
						transition={{ ease: easingCurves.gentle, duration: 0.2 }}
					>
						<div className="flex items-center gap-2">
							<TrendingUp className="h-4 w-4 text-blue-500" />
							<p className="font-medium text-muted-foreground text-sm">
								Best Streak
							</p>
						</div>
						<p className="font-bold text-3xl">{bestStreak}</p>
						<p className="text-muted-foreground text-xs">days</p>
					</motion.div>
				</div>

				{/* Calendar Heatmap */}
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<Calendar className="h-4 w-4" />
						<span>Last {weeksToShow} weeks</span>
					</div>

					<div className="flex gap-1 overflow-x-auto pb-2">
						{weeks.map((week, weekIndex) => (
							<div key={weekIndex} className="flex flex-col gap-1">
								{week.map((day, dayIndex) => {
									const intensity = day.active ? getIntensity(day.xpEarned) : 0;
									const date = new Date(day.date);

									return (
										<motion.div
											key={day.date}
											className={cn(
												"h-3 w-3 rounded-sm transition-colors",
												intensityColors[intensity],
											)}
											initial={{ scale: 0, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{
												delay: shouldReduceMotion
													? 0
													: (weekIndex * 7 + dayIndex) * 0.01,
												duration: shouldReduceMotion ? 0.01 : 0.2,
												ease: easingCurves.gentle,
											}}
											whileHover={
												shouldReduceMotion
													? {}
													: {
															scale: 1.5,
															zIndex: 10,
															transition: { duration: 0.1 },
														}
											}
											title={`${date.toLocaleDateString()}: ${day.xpEarned || 0} XP`}
										/>
									);
								})}
							</div>
						))}
					</div>

					{/* Legend */}
					<div className="flex items-center gap-2 text-muted-foreground text-xs">
						<span>Less</span>
						{intensityColors.map((color, i) => (
							<div key={i} className={cn("h-3 w-3 rounded-sm", color)} />
						))}
						<span>More</span>
					</div>
				</div>

				{/* Motivational Message */}
				{currentStreak > 0 && (
					<motion.div
						className="rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 p-3 text-center"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, ease: easingCurves.gentle }}
					>
						<p className="font-medium text-sm">
							{currentStreak === bestStreak && currentStreak > 1
								? "🔥 New record! Keep the momentum going!"
								: currentStreak >= 7
									? `🎯 Amazing consistency! ${bestStreak - currentStreak} days to beat your record!`
									: "💪 Great start! Keep building your streak!"}
						</p>
					</motion.div>
				)}
			</CardContent>
		</Card>
	);
}

StreakCalendar.displayName = "StreakCalendar";
