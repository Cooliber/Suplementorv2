"use client";

/**
 * Loading States for Form Submissions and Data Processing
 * Interactive feedback during async operations
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { durations, easings, springs } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
	DotsLoader,
	LoadingSpinner,
	PulseLoader,
} from "./AnimatedLoadingIndicators";

type LoadingState = "idle" | "loading" | "success" | "error";

interface LoadingButtonProps {
	children: React.ReactNode;
	isLoading?: boolean;
	loadingText?: string;
	successText?: string;
	onClick?: () => void | Promise<void>;
	disabled?: boolean;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
	children,
	isLoading = false,
	loadingText = "Ładowanie...",
	successText = "Gotowe!",
	onClick,
	disabled = false,
	variant = "default",
	size = "default",
	className = "",
}) => {
	const [state, setState] = useState<LoadingState>("idle");
	const shouldReduceMotion = useReducedMotion();

	const handleClick = async () => {
		if (!onClick || isLoading || disabled) return;

		setState("loading");
		try {
			await onClick();
			setState("success");
			setTimeout(() => setState("idle"), 2000);
		} catch (error) {
			setState("error");
			setTimeout(() => setState("idle"), 3000);
		}
	};

	const getButtonContent = () => {
		switch (state) {
			case "loading":
				return (
					<>
						<LoadingSpinner size="sm" className="mr-2" />
						{loadingText}
					</>
				);
			case "success":
				return (
					<>
						<CheckCircle className="mr-2 h-4 w-4" />
						{successText}
					</>
				);
			case "error":
				return (
					<>
						<XCircle className="mr-2 h-4 w-4" />
						Błąd
					</>
				);
			default:
				return children;
		}
	};

	return (
		<Button
			variant={state === "error" ? "destructive" : variant}
			size={size}
			disabled={isLoading || disabled || state === "loading"}
			onClick={handleClick}
			className={className}
		>
			<AnimatePresence mode="wait">
				<motion.div
					key={state}
					initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: durations.fast, ease: easings.calm }}
				>
					{getButtonContent()}
				</motion.div>
			</AnimatePresence>
		</Button>
	);
};

interface FormSubmissionStateProps {
	isSubmitting?: boolean;
	isSuccess?: boolean;
	isError?: boolean;
	successMessage?: string;
	errorMessage?: string;
	onRetry?: () => void;
	className?: string;
}

export const FormSubmissionState: React.FC<FormSubmissionStateProps> = ({
	isSubmitting = false,
	isSuccess = false,
	isError = false,
	successMessage = "Formularz został pomyślnie wysłany!",
	errorMessage = "Wystąpił błąd podczas wysyłania formularza.",
	onRetry,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	const getCurrentState = () => {
		if (isSubmitting) return "loading";
		if (isSuccess) return "success";
		if (isError) return "error";
		return "idle";
	};

	const state = getCurrentState();

	return (
		<AnimatePresence mode="wait">
			{state !== "idle" && (
				<motion.div
					initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: -20 }}
					transition={{ ...springs.gentle }}
					className={className}
				>
					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center gap-3">
								{state === "loading" && (
									<>
										<LoadingSpinner size="md" />
										<div>
											<p className="font-medium">Wysyłanie formularza...</p>
											<p className="text-muted-foreground text-sm">
												Proszę czekać, przetwarzamy Twoje dane.
											</p>
										</div>
									</>
								)}

								{state === "success" && (
									<>
										<div className="text-green-500">
											<CheckCircle className="h-6 w-6" />
										</div>
										<div>
											<p className="font-medium text-green-700 dark:text-green-400">
												{successMessage}
											</p>
											<p className="text-muted-foreground text-sm">
												Dziękujemy za przesłanie formularza.
											</p>
										</div>
									</>
								)}

								{state === "error" && (
									<>
										<div className="text-red-500">
											<XCircle className="h-6 w-6" />
										</div>
										<div className="flex-1">
											<p className="font-medium text-red-700 dark:text-red-400">
												{errorMessage}
											</p>
											{onRetry && (
												<Button
													variant="outline"
													size="sm"
													onClick={onRetry}
													className="mt-2"
												>
													Spróbuj ponownie
												</Button>
											)}
										</div>
									</>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

interface DataProcessingIndicatorProps {
	isProcessing?: boolean;
	progress?: number;
	currentStep?: string;
	totalSteps?: number;
	estimatedTime?: string;
	className?: string;
}

export const DataProcessingIndicator: React.FC<
	DataProcessingIndicatorProps
> = ({
	isProcessing = false,
	progress = 0,
	currentStep = "",
	totalSteps = 0,
	estimatedTime,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (!isProcessing && progress === 0) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
				animate={{ opacity: 1, height: "auto" }}
				exit={{ opacity: 0, height: 0 }}
				transition={{ duration: durations.normal, ease: easings.calm }}
				className={className}
			>
				<Card>
					<CardContent className="pt-6">
						<div className="space-y-4">
							{/* Header */}
							<div className="flex items-center gap-3">
								<PulseLoader size="md" />
								<div>
									<p className="font-medium">Przetwarzanie danych</p>
									{currentStep && (
										<p className="text-muted-foreground text-sm">
											Krok: {currentStep}
										</p>
									)}
								</div>
								{estimatedTime && (
									<div className="ml-auto text-right">
										<p className="font-medium text-sm">Pozostały czas</p>
										<p className="text-muted-foreground text-sm">
											{estimatedTime}
										</p>
									</div>
								)}
							</div>

							{/* Progress bar */}
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Postęp</span>
									<span>{Math.round(progress)}%</span>
								</div>
								<Progress value={progress} className="h-2" />
							</div>

							{/* Step indicators */}
							{totalSteps > 0 && (
								<div className="flex justify-between">
									{Array.from({ length: totalSteps }).map((_, index) => {
										const stepNumber = index + 1;
										const isCompleted =
											progress >= (stepNumber / totalSteps) * 100;
										const isCurrent =
											progress >= ((stepNumber - 1) / totalSteps) * 100 &&
											!isCompleted;

										return (
											<motion.div
												key={stepNumber}
												className={`flex flex-col items-center gap-1 ${
													isCompleted
														? "text-primary"
														: isCurrent
															? "text-primary/60"
															: "text-muted-foreground"
												}`}
												initial={shouldReduceMotion ? {} : { scale: 0 }}
												animate={{ scale: 1 }}
												transition={{
													delay: index * 0.1,
													...springs.gentle,
												}}
											>
												<div
													className={`flex h-6 w-6 items-center justify-center rounded-full font-medium text-xs ${
														isCompleted
															? "bg-primary text-primary-foreground"
															: isCurrent
																? "border border-primary bg-primary/10 text-primary"
																: "bg-muted"
													}`}
												>
													{isCompleted ? "✓" : stepNumber}
												</div>
												<span className="text-xs">Krok {stepNumber}</span>
											</motion.div>
										);
									})}
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</AnimatePresence>
	);
};

interface LoadingOverlayProps {
	isVisible?: boolean;
	message?: string;
	details?: string;
	showProgress?: boolean;
	progress?: number;
	variant?: "blur" | "dark" | "light";
	className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
	isVisible = false,
	message = "Ładowanie...",
	details,
	showProgress = false,
	progress = 0,
	variant = "blur",
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (!isVisible) return null;

	const overlayClasses = {
		blur: "bg-background/80 backdrop-blur-sm",
		dark: "bg-background/95",
		light: "bg-background/60",
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={shouldReduceMotion ? {} : { opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: durations.normal, ease: easings.calm }}
				className={`fixed inset-0 z-50 flex items-center justify-center ${overlayClasses[variant]} ${className}`}
			>
				<motion.div
					initial={shouldReduceMotion ? {} : { scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					transition={{ ...springs.gentle }}
				>
					<Card className="p-6">
						<div className="flex flex-col items-center gap-4">
							<LoadingSpinner size="lg" />

							<div className="space-y-2 text-center">
								<p className="font-medium">{message}</p>
								{details && (
									<p className="text-muted-foreground text-sm">{details}</p>
								)}
							</div>

							{showProgress && (
								<div className="w-full max-w-xs space-y-2">
									<div className="flex justify-between text-sm">
										<span>Postęp</span>
										<span>{Math.round(progress)}%</span>
									</div>
									<Progress value={progress} className="h-2" />
								</div>
							)}
						</div>
					</Card>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

interface StepByStepLoaderProps {
	steps: Array<{
		label: string;
		details?: string;
		status: "pending" | "loading" | "completed" | "error";
	}>;
	currentStep?: number;
	className?: string;
}

export const StepByStepLoader: React.FC<StepByStepLoaderProps> = ({
	steps,
	currentStep = 0,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	return (
		<div className={`space-y-4 ${className}`}>
			{steps.map((step, index) => {
				const isActive = index === currentStep;
				const isCompleted = index < currentStep;
				const isPending = index > currentStep;

				return (
					<motion.div
						key={index}
						className={`flex items-start gap-3 rounded-lg border p-3 ${
							isActive
								? "border-primary/20 bg-primary/5"
								: isCompleted
									? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
									: "bg-muted/30"
						}`}
						initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{
							delay: index * 0.1,
							duration: durations.normal,
							ease: easings.calm,
						}}
					>
						{/* Status indicator */}
						<div className="mt-0.5 flex-shrink-0">
							{isCompleted && (
								<div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
									<CheckCircle className="h-4 w-4 text-white" />
								</div>
							)}
							{isActive && step.status === "loading" && (
								<LoadingSpinner size="sm" />
							)}
							{isActive && step.status === "error" && (
								<div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
									<XCircle className="h-4 w-4 text-white" />
								</div>
							)}
							{isPending && (
								<div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
									<span className="font-medium text-muted-foreground text-xs">
										{index + 1}
									</span>
								</div>
							)}
						</div>

						{/* Step content */}
						<div className="flex-1">
							<p
								className={`font-medium ${
									isActive
										? "text-primary"
										: isCompleted
											? "text-green-700 dark:text-green-400"
											: ""
								}`}
							>
								{step.label}
							</p>
							{step.details && (
								<p className="mt-1 text-muted-foreground text-sm">
									{step.details}
								</p>
							)}
						</div>

						{/* Loading indicator for active step */}
						{isActive && step.status === "loading" && (
							<DotsLoader count={3} size="sm" />
						)}
					</motion.div>
				);
			})}
		</div>
	);
};

interface AsyncActionIndicatorProps {
	isLoading?: boolean;
	success?: boolean;
	error?: boolean;
	loadingMessage?: string;
	successMessage?: string;
	errorMessage?: string;
	onRetry?: () => void;
	showIcon?: boolean;
	className?: string;
}

export const AsyncActionIndicator: React.FC<AsyncActionIndicatorProps> = ({
	isLoading = false,
	success = false,
	error = false,
	loadingMessage = "Wykonywanie akcji...",
	successMessage = "Akcja została wykonana pomyślnie!",
	errorMessage = "Wystąpił błąd podczas wykonywania akcji.",
	onRetry,
	showIcon = true,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	const getCurrentState = () => {
		if (isLoading) return "loading";
		if (success) return "success";
		if (error) return "error";
		return "idle";
	};

	const state = getCurrentState();

	if (state === "idle") return null;

	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				transition={{ ...springs.gentle }}
				className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${className}`}
			>
				{state === "loading" && (
					<>
						{showIcon && <LoadingSpinner size="sm" />}
						<span>{loadingMessage}</span>
					</>
				)}

				{state === "success" && (
					<>
						{showIcon && <CheckCircle className="h-4 w-4 text-green-500" />}
						<span className="text-green-700 dark:text-green-400">
							{successMessage}
						</span>
					</>
				)}

				{state === "error" && (
					<div className="flex items-center gap-2">
						{showIcon && <XCircle className="h-4 w-4 text-red-500" />}
						<span className="text-red-700 dark:text-red-400">
							{errorMessage}
						</span>
						{onRetry && (
							<Button variant="outline" size="sm" onClick={onRetry}>
								Spróbuj ponownie
							</Button>
						)}
					</div>
				)}
			</motion.div>
		</AnimatePresence>
	);
};
