"use client";

/**
 * Loading Feedback for Background Operations
 * Status indicators and notifications for async background tasks
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	CheckCircle,
	XCircle,
	AlertCircle,
	Clock,
	Play,
	Pause,
	X,
	RefreshCw,
	Info
} from "lucide-react";
import { LoadingSpinner, PulseLoader, DotsLoader } from "./AnimatedLoadingIndicators";
import { useReducedMotion } from "@/lib/animations/hooks";
import { easings, durations, springs } from "@/lib/animations/config";

type OperationStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

interface BackgroundOperation {
	id: string;
	name: string;
	description?: string;
	status: OperationStatus;
	progress?: number;
	startTime: Date;
	estimatedTime?: number;
	error?: string;
}

interface BackgroundOperationIndicatorProps {
	operations: BackgroundOperation[];
	onCancel?: (operationId: string) => void;
	onRetry?: (operationId: string) => void;
	onPause?: (operationId: string) => void;
	onResume?: (operationId: string) => void;
	maxVisible?: number;
	className?: string;
}

export const BackgroundOperationIndicator: React.FC<BackgroundOperationIndicatorProps> = ({
	operations,
	onCancel,
	onRetry,
	onPause,
	onResume,
	maxVisible = 3,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();
	const [expanded, setExpanded] = useState(false);

	const visibleOperations = expanded ? operations : operations.slice(0, maxVisible);
	const hasMore = operations.length > maxVisible;

	const getStatusIcon = (status: OperationStatus) => {
		switch (status) {
			case "pending":
				return <Clock className="w-4 h-4 text-yellow-500" />;
			case "running":
				return <LoadingSpinner size="sm" />;
			case "completed":
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case "failed":
				return <XCircle className="w-4 h-4 text-red-500" />;
			case "cancelled":
				return <AlertCircle className="w-4 h-4 text-gray-500" />;
		}
	};

	const getStatusColor = (status: OperationStatus) => {
		switch (status) {
			case "pending":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
			case "running":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
			case "completed":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			case "failed":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
			case "cancelled":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
		}
	};

	if (operations.length === 0) return null;

	return (
		<Card className={className}>
			<CardContent className="pt-4">
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<h4 className="font-medium">Operacje w tle</h4>
						{hasMore && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setExpanded(!expanded)}
							>
								{expanded ? "Pokaż mniej" : `Pokaż więcej (${operations.length - maxVisible})`}
							</Button>
						)}
					</div>

					<div className="space-y-2">
						<AnimatePresence>
							{visibleOperations.map((operation, index) => (
								<motion.div
									key={operation.id}
									initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									transition={{
										delay: index * 0.05,
										duration: durations.normal,
										ease: easings.calm,
									}}
									className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
								>
									{/* Status icon */}
									{getStatusIcon(operation.status)}

									{/* Operation info */}
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<p className="font-medium truncate">{operation.name}</p>
											<Badge variant="secondary" className={getStatusColor(operation.status)}>
												{operation.status}
											</Badge>
										</div>

										{operation.description && (
											<p className="text-sm text-muted-foreground truncate mb-2">
												{operation.description}
											</p>
										)}

										{/* Progress bar for running operations */}
										{operation.status === "running" && operation.progress !== undefined && (
											<div className="space-y-1">
												<div className="flex justify-between text-xs">
													<span>Postęp</span>
													<span>{Math.round(operation.progress)}%</span>
												</div>
												<Progress value={operation.progress} className="h-1" />
											</div>
										)}

										{/* Time info */}
										<div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
											<span>
												Rozpoczęto: {operation.startTime.toLocaleTimeString()}
											</span>
											{operation.estimatedTime && (
												<span>
													Szacowany czas: {Math.round(operation.estimatedTime / 1000)}s
												</span>
											)}
										</div>
									</div>

									{/* Action buttons */}
									<div className="flex gap-1">
										{operation.status === "running" && onPause && (
											<Button variant="ghost" size="sm" onClick={() => onPause(operation.id)}>
												<Pause className="w-3 h-3" />
											</Button>
										)}

										{operation.status === "pending" && onResume && (
											<Button variant="ghost" size="sm" onClick={() => onResume(operation.id)}>
												<Play className="w-3 h-3" />
											</Button>
										)}

										{operation.status === "failed" && onRetry && (
											<Button variant="ghost" size="sm" onClick={() => onRetry(operation.id)}>
												<RefreshCw className="w-3 h-3" />
											</Button>
										)}

										{(operation.status === "pending" || operation.status === "running") && onCancel && (
											<Button variant="ghost" size="sm" onClick={() => onCancel(operation.id)}>
												<X className="w-3 h-3" />
											</Button>
										)}
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

interface FloatingNotificationProps {
	operations: BackgroundOperation[];
	position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
	maxNotifications?: number;
	autoHide?: boolean;
	autoHideDelay?: number;
	className?: string;
}

export const FloatingNotification: React.FC<FloatingNotificationProps> = ({
	operations,
	position = "top-right",
	maxNotifications = 5,
	autoHide = true,
	autoHideDelay = 5000,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();
	const [visibleOperations, setVisibleOperations] = useState<BackgroundOperation[]>([]);

	useEffect(() => {
		// Filter to only show running, completed, and failed operations
		const relevantOps = operations.filter(op =>
			op.status === "running" || op.status === "completed" || op.status === "failed"
		);

		setVisibleOperations(relevantOps.slice(0, maxNotifications));
	}, [operations, maxNotifications]);

	// Auto-hide completed operations
	useEffect(() => {
		if (!autoHide) return;

		visibleOperations.forEach(operation => {
			if (operation.status === "completed" || operation.status === "failed") {
				setTimeout(() => {
					setVisibleOperations(prev => prev.filter(op => op.id !== operation.id));
				}, autoHideDelay);
			}
		});
	}, [visibleOperations, autoHide, autoHideDelay]);

	const positionClasses = {
		"top-right": "top-4 right-4",
		"top-left": "top-4 left-4",
		"bottom-right": "bottom-4 right-4",
		"bottom-left": "bottom-4 left-4",
	};

	if (visibleOperations.length === 0) return null;

	return (
		<div className={`fixed ${positionClasses[position]} z-50 space-y-2 ${className}`}>
			<AnimatePresence>
				{visibleOperations.map((operation, index) => (
					<motion.div
						key={operation.id}
						initial={shouldReduceMotion ? {} : { opacity: 0, x: position.includes("right") ? 300 : -300, scale: 0.8 }}
						animate={{ opacity: 1, x: 0, scale: 1 }}
						exit={{ opacity: 0, x: position.includes("right") ? 300 : -300, scale: 0.8 }}
						transition={{
							...springs.gentle,
						}}
						className="bg-background border rounded-lg shadow-lg p-3 max-w-sm"
					>
						<div className="flex items-start gap-3">
							{/* Status icon */}
							{operation.status === "running" && <PulseLoader size="sm" />}
							{operation.status === "completed" && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
							{operation.status === "failed" && <XCircle className="w-5 h-5 text-red-500 mt-0.5" />}

							{/* Content */}
							<div className="flex-1 min-w-0">
								<p className="font-medium truncate">{operation.name}</p>
								{operation.description && (
									<p className="text-sm text-muted-foreground truncate">
										{operation.description}
									</p>
								)}

								{/* Progress for running operations */}
								{operation.status === "running" && operation.progress !== undefined && (
									<div className="mt-2">
										<Progress value={operation.progress} className="h-1" />
										<p className="text-xs text-muted-foreground mt-1">
											{Math.round(operation.progress)}%
										</p>
									</div>
								)}

								{/* Error message */}
								{operation.status === "failed" && operation.error && (
									<p className="text-xs text-red-600 dark:text-red-400 mt-1">
										{operation.error}
									</p>
								)}
							</div>
						</div>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};

interface OperationQueueProps {
	operations: BackgroundOperation[];
	onReorder?: (operations: BackgroundOperation[]) => void;
	onCancel?: (operationId: string) => void;
	onRetry?: (operationId: string) => void;
	className?: string;
}

export const OperationQueue: React.FC<OperationQueueProps> = ({
	operations,
	onReorder,
	onCancel,
	onRetry,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	const getStatusIcon = (status: OperationStatus) => {
		switch (status) {
			case "pending":
				return <Clock className="w-4 h-4 text-yellow-500" />;
			case "running":
				return <LoadingSpinner size="sm" />;
			case "completed":
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case "failed":
				return <XCircle className="w-4 h-4 text-red-500" />;
			case "cancelled":
				return <AlertCircle className="w-4 h-4 text-gray-500" />;
		}
	};

	const getStatusColor = (status: OperationStatus) => {
		switch (status) {
			case "pending":
				return "border-l-yellow-500";
			case "running":
				return "border-l-blue-500";
			case "completed":
				return "border-l-green-500";
			case "failed":
				return "border-l-red-500";
			case "cancelled":
				return "border-l-gray-500";
		}
	};

	return (
		<Card className={className}>
			<CardContent className="pt-4">
				<div className="space-y-3">
					<h4 className="font-medium">Kolejka operacji</h4>

					<div className="space-y-2">
						{operations.map((operation, index) => (
							<motion.div
								key={operation.id}
								initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									delay: index * 0.05,
									duration: durations.normal,
									ease: easings.calm,
								}}
								className={`flex items-center gap-3 p-3 border-l-4 rounded-r-lg ${getStatusColor(operation.status)}`}
							>
								{/* Drag handle */}
								{onReorder && (
									<div className="cursor-move text-muted-foreground">
										<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M4 7a1 1 0 011-1h.01a1 1 0 110 2H5a1 1 0 01-1-1zM4 12a1 1 0 011-1h.01a1 1 0 110 2H5a1 1 0 01-1-1zM4 17a1 1 0 011-1h.01a1 1 0 110 2H5a1 1 0 01-1-1zM9 7a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM9 12a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM9 17a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
										</svg>
									</div>
								)}

								{/* Status icon */}
								{getStatusIcon(operation.status)}

								{/* Operation info */}
								<div className="flex-1 min-w-0">
									<p className="font-medium truncate">{operation.name}</p>
									{operation.description && (
										<p className="text-sm text-muted-foreground truncate">
											{operation.description}
										</p>
									)}

									{/* Progress */}
									{operation.status === "running" && operation.progress !== undefined && (
										<div className="mt-2">
											<Progress value={operation.progress} className="h-1" />
										</div>
									)}
								</div>

								{/* Actions */}
								<div className="flex gap-1">
									{operation.status === "failed" && onRetry && (
										<Button variant="ghost" size="sm" onClick={() => onRetry(operation.id)}>
											<RefreshCw className="w-3 h-3" />
										</Button>
									)}

									{(operation.status === "pending" || operation.status === "running") && onCancel && (
										<Button variant="ghost" size="sm" onClick={() => onCancel(operation.id)}>
											<X className="w-3 h-3" />
										</Button>
									)}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

interface PersistentLoadingIndicatorProps {
	isVisible?: boolean;
	message?: string;
	progress?: number;
	position?: "top" | "bottom" | "inline";
	showCloseButton?: boolean;
	onClose?: () => void;
	className?: string;
}

export const PersistentLoadingIndicator: React.FC<PersistentLoadingIndicatorProps> = ({
	isVisible = false,
	message = "Wykonywanie operacji...",
	progress = 0,
	position = "top",
	showCloseButton = false,
	onClose,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (!isVisible) return null;

	const positionClasses = {
		top: "top-0 left-0 right-0",
		bottom: "bottom-0 left-0 right-0",
		inline: "",
	};

	if (position === "inline") {
		return (
			<motion.div
				initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				transition={{ ...springs.gentle }}
				className={`flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg ${className}`}
			>
				<LoadingSpinner size="sm" />
				<div className="flex-1">
					<p className="font-medium">{message}</p>
					{progress !== undefined && (
						<div className="mt-1">
							<Progress value={progress} className="h-1" />
						</div>
					)}
				</div>
				{showCloseButton && onClose && (
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="w-4 h-4" />
					</Button>
				)}
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={shouldReduceMotion ? {} : { opacity: 0, y: position === "top" ? -100 : 100 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: position === "top" ? -100 : 100 }}
			transition={{ ...springs.gentle }}
			className={`fixed ${positionClasses[position]} z-50 ${className}`}
		>
			<Card className="mx-4 mb-4">
				<CardContent className="pt-4">
					<div className="flex items-center gap-3">
						<LoadingSpinner size="md" />
						<div className="flex-1">
							<p className="font-medium">{message}</p>
							{progress !== undefined && (
								<div className="mt-2 space-y-1">
									<div className="flex justify-between text-sm">
										<span>Postęp</span>
										<span>{Math.round(progress)}%</span>
									</div>
									<Progress value={progress} className="h-2" />
								</div>
							)}
						</div>
						{showCloseButton && onClose && (
							<Button variant="ghost" size="sm" onClick={onClose}>
								<X className="w-4 h-4" />
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

interface StatusToastProps {
	operation: BackgroundOperation;
	onDismiss?: () => void;
	autoHide?: boolean;
	className?: string;
}

export const StatusToast: React.FC<StatusToastProps> = ({
	operation,
	onDismiss,
	autoHide = true,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		if (autoHide && (operation.status === "completed" || operation.status === "failed")) {
			const timer = setTimeout(() => {
				onDismiss?.();
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [operation.status, autoHide, onDismiss]);

	const getStatusColor = (status: OperationStatus) => {
		switch (status) {
			case "completed":
				return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800";
			case "failed":
				return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800";
			case "running":
				return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800";
			default:
				return "bg-background border";
		}
	};

	const getStatusIcon = (status: OperationStatus) => {
		switch (status) {
			case "completed":
				return <CheckCircle className="w-5 h-5 text-green-500" />;
			case "failed":
				return <XCircle className="w-5 h-5 text-red-500" />;
			case "running":
				return <LoadingSpinner size="sm" />;
			default:
				return <Info className="w-5 h-5 text-blue-500" />;
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8, y: 50 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.8, y: 50 }}
				transition={{ ...springs.gentle }}
				className={`border rounded-lg p-4 ${getStatusColor(operation.status)} ${className}`}
			>
				<div className="flex items-start gap-3">
					{getStatusIcon(operation.status)}

					<div className="flex-1">
						<p className="font-medium">{operation.name}</p>
						{operation.description && (
							<p className="text-sm text-muted-foreground mt-1">
								{operation.description}
							</p>
						)}

						{operation.status === "running" && operation.progress !== undefined && (
							<div className="mt-2">
								<Progress value={operation.progress} className="h-1" />
								<p className="text-xs text-muted-foreground mt-1">
									{Math.round(operation.progress)}% ukończone
								</p>
							</div>
						)}

						{operation.status === "failed" && operation.error && (
							<p className="text-sm text-red-600 dark:text-red-400 mt-1">
								{operation.error}
							</p>
						)}
					</div>

					{onDismiss && (
						<Button variant="ghost" size="sm" onClick={onDismiss}>
							<X className="w-4 h-4" />
						</Button>
					)}
				</div>
			</motion.div>
		</AnimatePresence>
	);
};