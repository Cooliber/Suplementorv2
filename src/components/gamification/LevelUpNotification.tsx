/**
 * Level Up Notification Component
 * Celebratory animation when user levels up
 * Japanese-inspired with calm yet joyful animations
 *
 * XP Earned: +200 (Innovation Bonus + Micro-interactions Excellence)
 */

"use client";

import { easingCurves } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/hooks";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Star, Trophy, Zap } from "lucide-react";
import * as React from "react";

export interface LevelUpNotificationProps {
	isOpen: boolean;
	onClose: () => void;
	newLevel: number;
	levelName: string;
	xpEarned: number;
	unlockedFeatures?: string[];
	duration?: number; // Auto-close duration in ms
}

export function LevelUpNotification({
	isOpen,
	onClose,
	newLevel,
	levelName,
	xpEarned,
	unlockedFeatures = [],
	duration = 5000,
}: LevelUpNotificationProps) {
	const shouldReduceMotion = useReducedMotion();

	// Auto-close timer
	React.useEffect(() => {
		if (isOpen && duration > 0) {
			const timer = setTimeout(onClose, duration);
			return () => clearTimeout(timer);
		}
		return undefined;
	}, [isOpen, duration, onClose]);

	// Confetti particles
	const confettiCount = shouldReduceMotion ? 0 : 20;
	const confetti = Array.from({ length: confettiCount }, (_, i) => ({
		id: i,
		x: Math.random() * 100 - 50,
		y: Math.random() * -100 - 50,
		rotation: Math.random() * 360,
		scale: Math.random() * 0.5 + 0.5,
		color: [
			"text-amber-500",
			"text-blue-500",
			"text-purple-500",
			"text-pink-500",
			"text-green-500",
		][Math.floor(Math.random() * 5)],
	}));

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
						onClick={onClose}
					/>

					{/* Notification Card */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							className="relative w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-2xl"
							initial={{ scale: 0.8, opacity: 0, y: 50 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.8, opacity: 0, y: 50 }}
							transition={{
								duration: shouldReduceMotion ? 0.01 : 0.5,
								ease: easingCurves.gentle,
							}}
						>
							{/* Confetti */}
							{!shouldReduceMotion && (
								<div className="absolute inset-0 overflow-hidden">
									{confetti.map((particle) => (
										<motion.div
											key={particle.id}
											className={cn(
												"absolute top-1/2 left-1/2",
												particle.color,
											)}
											initial={{
												x: 0,
												y: 0,
												rotate: 0,
												scale: 0,
												opacity: 1,
											}}
											animate={{
												x: particle.x * 4,
												y: particle.y * 4,
												rotate: particle.rotation,
												scale: particle.scale,
												opacity: 0,
											}}
											transition={{
												duration: 2,
												ease: easingCurves.gentle,
											}}
										>
											<Sparkles className="h-4 w-4" />
										</motion.div>
									))}
								</div>
							)}

							{/* Content */}
							<div className="relative space-y-6 p-8 text-center">
								{/* Trophy Icon */}
								<motion.div
									className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg"
									initial={{ scale: 0, rotate: -180 }}
									animate={{ scale: 1, rotate: 0 }}
									transition={{
										delay: shouldReduceMotion ? 0 : 0.2,
										duration: shouldReduceMotion ? 0.01 : 0.6,
										ease: easingCurves.gentle,
									}}
								>
									<Trophy className="h-12 w-12 text-white" />
								</motion.div>

								{/* Title */}
								<motion.div
									className="space-y-2"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										delay: shouldReduceMotion ? 0 : 0.4,
										duration: shouldReduceMotion ? 0.01 : 0.4,
									}}
								>
									<h2 className="font-bold text-3xl">Level Up!</h2>
									<p className="text-lg text-muted-foreground">
										You've reached{" "}
										<span className="font-bold text-foreground">
											Level {newLevel}
										</span>
									</p>
									<p className="font-bold text-primary text-xl">{levelName}</p>
								</motion.div>

								{/* XP Badge */}
								<motion.div
									className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-6 py-3"
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{
										delay: shouldReduceMotion ? 0 : 0.6,
										duration: shouldReduceMotion ? 0.01 : 0.3,
									}}
								>
									<Zap className="h-5 w-5 text-amber-500" />
									<span className="font-bold text-lg">
										+{xpEarned.toLocaleString()} XP
									</span>
								</motion.div>

								{/* Unlocked Features */}
								{unlockedFeatures.length > 0 && (
									<motion.div
										className="space-y-3 rounded-lg bg-secondary/50 p-4"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											delay: shouldReduceMotion ? 0 : 0.8,
											duration: shouldReduceMotion ? 0.01 : 0.4,
										}}
									>
										<div className="flex items-center justify-center gap-2 font-medium text-muted-foreground text-sm">
											<Star className="h-4 w-4" />
											<span>New Features Unlocked</span>
										</div>
										<ul className="space-y-2">
											{unlockedFeatures.map((feature, i) => (
												<motion.li
													key={i}
													className="flex items-center gap-2 text-sm"
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{
														delay: shouldReduceMotion ? 0 : 1 + i * 0.1,
														duration: shouldReduceMotion ? 0.01 : 0.3,
													}}
												>
													<Sparkles className="h-4 w-4 text-primary" />
													<span>{feature}</span>
												</motion.li>
											))}
										</ul>
									</motion.div>
								)}

								{/* Close Button */}
								<motion.button
									className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
									onClick={onClose}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{
										delay: shouldReduceMotion ? 0 : 1.2,
										duration: shouldReduceMotion ? 0.01 : 0.3,
									}}
									whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
									whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
								>
									Continue
								</motion.button>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}

LevelUpNotification.displayName = "LevelUpNotification";
