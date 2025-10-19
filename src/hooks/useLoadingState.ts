"use client";

/**
 * Loading State Management Hooks and Utilities
 * Centralized loading state management for React components
 */

import { useCallback, useEffect, useRef, useState } from "react";

interface LoadingState {
	isLoading: boolean;
	progress?: number;
	error?: Error | null;
	data?: any;
}

interface UseLoadingOptions {
	initialLoading?: boolean;
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
	timeout?: number;
}

export function useLoadingState<T = any>(options: UseLoadingOptions = {}) {
	const { initialLoading = false, onSuccess, onError, timeout } = options;

	const [state, setState] = useState<LoadingState>({
		isLoading: initialLoading,
		progress: 0,
		error: null,
		data: null,
	});

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (timeout && state.isLoading) {
			timeoutRef.current = setTimeout(() => {
				setState((prev) => ({
					...prev,
					isLoading: false,
					error: new Error("Operation timed out"),
				}));
				onError?.(new Error("Operation timed out"));
			}, timeout);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [timeout, state.isLoading, onError]);

	const startLoading = useCallback((initialProgress = 0) => {
		setState({
			isLoading: true,
			progress: initialProgress,
			error: null,
			data: null,
		});
	}, []);

	const updateProgress = useCallback((progress: number) => {
		setState((prev) => ({
			...prev,
			progress: Math.min(Math.max(progress, 0), 100),
		}));
	}, []);

	const setError = useCallback(
		(error: Error) => {
			setState((prev) => ({
				...prev,
				isLoading: false,
				error,
			}));
			onError?.(error);
		},
		[onError],
	);

	const setSuccess = useCallback(
		(data: T) => {
			setState({
				isLoading: false,
				progress: 100,
				error: null,
				data,
			});
			onSuccess?.(data);
		},
		[onSuccess],
	);

	const reset = useCallback(() => {
		setState({
			isLoading: false,
			progress: 0,
			error: null,
			data: null,
		});
	}, []);

	return {
		...state,
		startLoading,
		updateProgress,
		setError,
		setSuccess,
		reset,
	};
}

interface UseAsyncOperationOptions<T> {
	onSuccess?: (data: T) => void;
	onError?: (error: Error) => void;
	timeout?: number;
}

export function useAsyncOperation<T = any>(
	options: UseAsyncOperationOptions<T> = {},
) {
	const { onSuccess, onError, timeout } = options;
	const [operationState, setOperationState] = useState<{
		isRunning: boolean;
		currentOperation?: string;
		operations: Map<string, { progress: number; status: string }>;
	}>({
		isRunning: false,
		operations: new Map(),
	});

	const executeAsync = useCallback(
		async <TResult = T>(
			operation: () => Promise<TResult>,
			operationName?: string,
			progressCallback?: (progress: number) => void,
		): Promise<TResult | null> => {
			const opId = operationName || `operation_${Date.now()}`;

			setOperationState((prev) => ({
				isRunning: true,
				currentOperation: opId,
				operations: new Map(
					prev.operations.set(opId, { progress: 0, status: "running" }),
				),
			}));

			try {
				const result = await operation();

				setOperationState((prev) => {
					const newOps = new Map(prev.operations);
					newOps.set(opId, { progress: 100, status: "completed" });
					return {
						...prev,
						operations: newOps,
					};
				});

				onSuccess?.(result as T);
				return result;
			} catch (error) {
				const err = error instanceof Error ? error : new Error(String(error));

				setOperationState((prev) => {
					const newOps = new Map(prev.operations);
					newOps.set(opId, { progress: 0, status: "error" });
					return {
						...prev,
						operations: newOps,
					};
				});

				onError?.(err);
				return null;
			} finally {
				// Clean up completed operations after a delay
				setTimeout(() => {
					setOperationState((prev) => {
						const newOps = new Map(prev.operations);
						newOps.delete(opId);
						return {
							...prev,
							isRunning: newOps.size > 0,
							currentOperation:
								newOps.size > 0 ? prev.currentOperation : undefined,
							operations: newOps,
						};
					});
				}, 3000);
			}
		},
		[onSuccess, onError],
	);

	const cancelOperation = useCallback((operationId: string) => {
		setOperationState((prev) => {
			const newOps = new Map(prev.operations);
			newOps.set(operationId, { progress: 0, status: "cancelled" });
			return {
				...prev,
				operations: newOps,
			};
		});
	}, []);

	return {
		...operationState,
		executeAsync,
		cancelOperation,
	};
}

interface UseProgressiveLoaderOptions {
	autoAdvance?: boolean;
	stepDuration?: number;
	onStepChange?: (step: number, total: number) => void;
	onComplete?: () => void;
}

export function useProgressiveLoader(
	steps: number,
	options: UseProgressiveLoaderOptions = {},
) {
	const {
		autoAdvance = false,
		stepDuration = 1000,
		onStepChange,
		onComplete,
	} = options;

	const [currentStep, setCurrentStep] = useState(0);
	const [isPlaying, setIsPlaying] = useState(autoAdvance);

	useEffect(() => {
		if (!isPlaying || currentStep >= steps) return;

		const timer = setTimeout(() => {
			setCurrentStep((prev) => {
				const next = prev + 1;
				onStepChange?.(next, steps);

				if (next >= steps) {
					setIsPlaying(false);
					onComplete?.();
					return steps;
				}

				return next;
			});
		}, stepDuration);

		return () => clearTimeout(timer);
	}, [currentStep, isPlaying, steps, stepDuration, onStepChange, onComplete]);

	const nextStep = useCallback(() => {
		setCurrentStep((prev) => {
			const next = prev + 1;
			onStepChange?.(next, steps);

			if (next >= steps) {
				setIsPlaying(false);
				onComplete?.();
			}

			return Math.min(next, steps);
		});
	}, [steps, onStepChange, onComplete]);

	const prevStep = useCallback(() => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	}, []);

	const goToStep = useCallback(
		(step: number) => {
			const clampedStep = Math.min(Math.max(step, 0), steps);
			setCurrentStep(clampedStep);
			onStepChange?.(clampedStep, steps);
		},
		[steps, onStepChange],
	);

	const play = useCallback(() => {
		setIsPlaying(true);
	}, []);

	const pause = useCallback(() => {
		setIsPlaying(false);
	}, []);

	const reset = useCallback(() => {
		setCurrentStep(0);
		setIsPlaying(autoAdvance);
		onStepChange?.(0, steps);
	}, [autoAdvance, steps, onStepChange]);

	const progress = ((currentStep + 1) / steps) * 100;

	return {
		currentStep,
		isPlaying,
		progress,
		nextStep,
		prevStep,
		goToStep,
		play,
		pause,
		reset,
		isComplete: currentStep >= steps - 1,
	};
}

interface UseDebouncedLoadingOptions {
	debounceMs?: number;
	minLoadingTime?: number;
}

export function useDebouncedLoading(options: UseDebouncedLoadingOptions = {}) {
	const { debounceMs = 300, minLoadingTime = 0 } = options;

	const [isLoading, setIsLoading] = useState(false);
	const [showLoading, setShowLoading] = useState(false);
	const startTimeRef = useRef<number | null>(null);
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const minTimeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
			if (minTimeTimeoutRef.current) {
				clearTimeout(minTimeTimeoutRef.current);
			}
		};
	}, []);

	const startLoading = useCallback(() => {
		startTimeRef.current = Date.now();

		// Debounce the loading state
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}

		debounceTimeoutRef.current = setTimeout(() => {
			setIsLoading(true);
			setShowLoading(true);
		}, debounceMs);
	}, [debounceMs]);

	const stopLoading = useCallback(() => {
		const elapsedTime = startTimeRef.current
			? Date.now() - startTimeRef.current
			: 0;

		// Clear debounce timeout
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}

		// Ensure minimum loading time
		if (elapsedTime < minLoadingTime) {
			minTimeTimeoutRef.current = setTimeout(() => {
				setIsLoading(false);
				setShowLoading(false);
			}, minLoadingTime - elapsedTime);
		} else {
			setIsLoading(false);
			setShowLoading(false);
		}
	}, [minLoadingTime]);

	return {
		isLoading,
		showLoading,
		startLoading,
		stopLoading,
	};
}

interface UseBackgroundTaskOptions {
	onComplete?: (result: any) => void;
	onError?: (error: Error) => void;
	onProgress?: (progress: number) => void;
}

export function useBackgroundTask<T = any>(
	options: UseBackgroundTaskOptions = {},
) {
	const { onComplete, onError, onProgress } = options;
	const [tasks, setTasks] = useState<
		Map<
			string,
			{
				status: "pending" | "running" | "completed" | "failed";
				progress: number;
				result?: T;
				error?: Error;
				startTime: Date;
			}
		>
	>(new Map());

	const addTask = useCallback(
		(taskId: string, task: () => Promise<T>) => {
			const startTime = new Date();

			setTasks(
				(prev) =>
					new Map(
						prev.set(taskId, {
							status: "pending",
							progress: 0,
							startTime,
						}),
					),
			);

			// Simulate task execution
			setTimeout(async () => {
				setTasks((prev) => {
					const newTasks = new Map(prev);
					const taskData = newTasks.get(taskId);
					if (taskData) {
						newTasks.set(taskId, { ...taskData, status: "running" });
					}
					return newTasks;
				});

				try {
					// Simulate progress updates
					const progressInterval = setInterval(() => {
						setTasks((prev) => {
							const newTasks = new Map(prev);
							const taskData = newTasks.get(taskId);
							if (taskData && taskData.status === "running") {
								const newProgress = Math.min(
									taskData.progress + Math.random() * 20,
									90,
								);
								newTasks.set(taskId, { ...taskData, progress: newProgress });
								onProgress?.(newProgress);
							}
							return newTasks;
						});
					}, 200);

					const result = await task();

					clearInterval(progressInterval);

					setTasks((prev) => {
						const newTasks = new Map(prev);
						newTasks.set(taskId, {
							status: "completed",
							progress: 100,
							result,
							startTime,
						});
						return newTasks;
					});

					onComplete?.(result);
				} catch (error) {
					setTasks((prev) => {
						const newTasks = new Map(prev);
						newTasks.set(taskId, {
							status: "failed",
							progress: 0,
							error: error instanceof Error ? error : new Error(String(error)),
							startTime,
						});
						return newTasks;
					});

					onError?.(error instanceof Error ? error : new Error(String(error)));
				}
			}, 100);
		},
		[onComplete, onError, onProgress],
	);

	const cancelTask = useCallback((taskId: string) => {
		setTasks((prev) => {
			const newTasks = new Map(prev);
			const taskData = newTasks.get(taskId);
			if (taskData && taskData.status === "running") {
				newTasks.set(taskId, { ...taskData, status: "failed" });
			}
			return newTasks;
		});
	}, []);

	const removeTask = useCallback((taskId: string) => {
		setTasks((prev) => {
			const newTasks = new Map(prev);
			newTasks.delete(taskId);
			return newTasks;
		});
	}, []);

	return {
		tasks,
		addTask,
		cancelTask,
		removeTask,
	};
}

// Utility functions for common loading patterns
export const loadingUtils = {
	// Simulate network delay
	delay: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),

	// Create a promise that resolves after a random delay (for testing)
	randomDelay: (min = 500, max = 2000) =>
		new Promise((resolve) =>
			setTimeout(resolve, Math.random() * (max - min) + min),
		),

	// Create progress simulation
	simulateProgress: (
		onProgress: (progress: number) => void,
		duration = 2000,
		steps = 20,
	) => {
		const stepDuration = duration / steps;
		let currentStep = 0;

		const interval = setInterval(() => {
			currentStep++;
			const progress = (currentStep / steps) * 100;
			onProgress(Math.min(progress, 100));

			if (currentStep >= steps) {
				clearInterval(interval);
			}
		}, stepDuration);

		return () => clearInterval(interval);
	},

	// Retry function with exponential backoff
	retry: async <T>(
		fn: () => Promise<T>,
		maxAttempts = 3,
		baseDelay = 1000,
	): Promise<T> => {
		let lastError: Error;

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				return await fn();
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));

				if (attempt === maxAttempts) {
					throw lastError;
				}

				const delay = baseDelay * 2 ** (attempt - 1);
				await loadingUtils.delay(delay);
			}
		}

		throw lastError!;
	},
};
