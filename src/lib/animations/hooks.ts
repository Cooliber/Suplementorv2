/**
 * Animation Hooks
 * Custom hooks for managing animations with reduced motion support
 */

"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";
import { useEffect, useState } from "react";
import { reducedMotionTransition, transitions } from "./config";

/**
 * Hook to detect reduced motion preference
 * Respects user's system preferences for accessibility
 */
export function useReducedMotion(): boolean {
	const prefersReducedMotion = useFramerReducedMotion();
	return prefersReducedMotion ?? false;
}

/**
 * Hook to get appropriate transition based on reduced motion preference
 */
export function useTransition(
	transition: Transition = transitions.default,
): Transition {
	const shouldReduceMotion = useReducedMotion();
	return shouldReduceMotion ? reducedMotionTransition : transition;
}

/**
 * Hook for scroll-triggered animations
 * Uses Intersection Observer for performance
 */
export function useScrollReveal(options: IntersectionObserverInit = {}) {
	const [isVisible, setIsVisible] = useState(false);
	const [ref, setRef] = useState<Element | null>(null);

	useEffect(() => {
		if (!ref) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setIsVisible(true);
					// Optionally unobserve after first reveal
					// observer.unobserve(ref);
				}
			},
			{
				threshold: 0.1,
				rootMargin: "50px",
				...options,
			},
		);

		observer.observe(ref);

		return () => {
			observer.disconnect();
		};
	}, [ref, options]);

	return { ref: setRef, isVisible };
}

/**
 * Hook for stagger animation timing
 */
export function useStaggerDelay(index: number, baseDelay = 0.05): number {
	const shouldReduceMotion = useReducedMotion();
	return shouldReduceMotion ? 0 : index * baseDelay;
}

/**
 * Hook for managing animation states
 */
export function useAnimationState(initialState = "hidden") {
	const [animationState, setAnimationState] = useState(initialState);
	const shouldReduceMotion = useReducedMotion();

	const trigger = (state: string) => {
		if (shouldReduceMotion) {
			setAnimationState("visible");
		} else {
			setAnimationState(state);
		}
	};

	return { animationState, trigger, setAnimationState };
}

/**
 * Hook for hover animations with reduced motion support
 */
export function useHoverAnimation() {
	const [isHovered, setIsHovered] = useState(false);
	const shouldReduceMotion = useReducedMotion();

	return {
		isHovered: shouldReduceMotion ? false : isHovered,
		onHoverStart: () => setIsHovered(true),
		onHoverEnd: () => setIsHovered(false),
	};
}

/**
 * Hook for managing page transitions
 */
export function usePageTransition() {
	const [isExiting, setIsExiting] = useState(false);
	const shouldReduceMotion = useReducedMotion();

	const startExit = () => {
		if (!shouldReduceMotion) {
			setIsExiting(true);
		}
	};

	const endExit = () => {
		setIsExiting(false);
	};

	return { isExiting, startExit, endExit };
}

/**
 * Hook for gesture detection
 */
export function useGesture() {
	const shouldReduceMotion = useReducedMotion();

	return {
		enabled: !shouldReduceMotion,
		onSwipe: (
			direction: "left" | "right" | "up" | "down",
			callback: () => void,
		) => {
			if (!shouldReduceMotion) {
				callback();
			}
		},
	};
}

/**
 * Hook for managing loading animations
 */
export function useLoadingAnimation(isLoading: boolean) {
	const shouldReduceMotion = useReducedMotion();
	const [showLoading, setShowLoading] = useState(isLoading);

	useEffect(() => {
		if (isLoading) {
			setShowLoading(true);
			return undefined; // explicit return for TS7030
		}
		// Delay hiding to allow exit animation
		const timeout = setTimeout(
			() => {
				setShowLoading(false);
			},
			shouldReduceMotion ? 0 : 300,
		);

		return () => clearTimeout(timeout);
	}, [isLoading, shouldReduceMotion]);

	return { showLoading, shouldReduceMotion };
}

/**
 * Hook for managing focus animations
 */
export function useFocusAnimation() {
	const [isFocused, setIsFocused] = useState(false);
	const shouldReduceMotion = useReducedMotion();

	return {
		isFocused: shouldReduceMotion ? false : isFocused,
		onFocus: () => setIsFocused(true),
		onBlur: () => setIsFocused(false),
	};
}

/**
 * Hook for sequential animations
 */
export function useSequentialAnimation(steps: number, delay = 100) {
	const [currentStep, setCurrentStep] = useState(0);
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		if (shouldReduceMotion) {
			setCurrentStep(steps - 1);
			return undefined; // explicit return for TS7030
		}

		if (currentStep < steps - 1) {
			const timeout = setTimeout(() => {
				setCurrentStep((prev) => prev + 1);
			}, delay);

			return () => clearTimeout(timeout);
		}
		return undefined; // ensure a return value on all paths
	}, [currentStep, steps, delay, shouldReduceMotion]);

	const reset = () => setCurrentStep(0);

	return { currentStep, reset, isComplete: currentStep >= steps - 1 };
}

/**
 * Hook for parallax scrolling effect
 */
export function useParallax(speed = 0.5) {
	const [offset, setOffset] = useState(0);
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		if (shouldReduceMotion) return;

		const handleScroll = () => {
			setOffset(window.pageYOffset * speed);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [speed, shouldReduceMotion]);

	return shouldReduceMotion ? 0 : offset;
}

/**
 * Hook for managing animation delays
 */
export function useAnimationDelay(delay = 0) {
	const [isReady, setIsReady] = useState(delay === 0);
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		if (shouldReduceMotion || delay === 0) {
			setIsReady(true);
			return;
		}

		const timeout = setTimeout(() => {
			setIsReady(true);
		}, delay);

		return () => clearTimeout(timeout);
	}, [delay, shouldReduceMotion]);

	return isReady;
}

/**
 * Hook for managing exit animations
 */
export function useExitAnimation(onExitComplete?: () => void) {
	const [isExiting, setIsExiting] = useState(false);
	const shouldReduceMotion = useReducedMotion();

	const startExit = () => {
		setIsExiting(true);

		if (shouldReduceMotion && onExitComplete) {
			onExitComplete();
		}
	};

	const handleExitComplete = () => {
		setIsExiting(false);
		if (onExitComplete) {
			onExitComplete();
		}
	};

	return {
		isExiting,
		startExit,
		onExitComplete: handleExitComplete,
	};
}

/**
 * Hook for managing spring animations
 */
export function useSpringAnimation(value: number, config?: any) {
	const shouldReduceMotion = useReducedMotion();

	// If reduced motion, return value directly without spring
	if (shouldReduceMotion) {
		return value;
	}

	// Otherwise use spring animation
	return value; // In actual implementation, would use useSpring from framer-motion
}
