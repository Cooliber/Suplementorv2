"use client";

/**
 * Responsive Animation Interface for Suplementor
 * Adaptive UI that scales based on screen size and orientation
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Activity,
	BookOpen,
	Eye,
	Maximize2,
	Minimize2,
	Monitor,
	RotateCw,
	Settings,
	Smartphone,
	Split,
	Square,
	Tablet,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

import {
	DEFAULT_MOBILE_ANIMATION_CONFIG,
	type GestureCallbacks,
	type MobileAnimationConfig,
} from "@/lib/animations/mobile-touch-interfaces";
import { useAdvancedTouchGestures } from "@/lib/animations/useAdvancedTouchGestures";
import { MobileAnimationControls } from "./MobileAnimationControls";

interface ResponsiveAnimationInterfaceProps {
	sequenceId?: string;
	onStepChange?: (stepId: string, progress: number) => void;
	onAnimationTrigger?: (animationId: string, stepId: string) => void;
	className?: string;
	autoPlay?: boolean;
	showEducationalContent?: boolean;
	enableAudio?: boolean;
	config?: Partial<MobileAnimationConfig>;
	children?: React.ReactNode; // 3D animation content
}

interface ScreenMetrics {
	width: number;
	height: number;
	orientation: "portrait" | "landscape";
	deviceType: "mobile" | "tablet" | "desktop";
	pixelRatio: number;
	touchPoints: number;
}

interface AdaptiveLayout {
	layout: "stacked" | "split" | "overlay" | "fullscreen";
	controlSize: "compact" | "normal" | "expanded";
	contentRatio: number; // Split-screen ratio
	showLabels: boolean;
	enableGestures: boolean;
}

const LAYOUT_PRESETS = {
	mobilePortrait: {
		layout: "stacked" as const,
		controlSize: "compact" as const,
		contentRatio: 0.6,
		showLabels: false,
		enableGestures: true,
	},
	mobileLandscape: {
		layout: "split" as const,
		controlSize: "normal" as const,
		contentRatio: 0.5,
		showLabels: true,
		enableGestures: true,
	},
	tabletPortrait: {
		layout: "split" as const,
		controlSize: "normal" as const,
		contentRatio: 0.4,
		showLabels: true,
		enableGestures: true,
	},
	tabletLandscape: {
		layout: "split" as const,
		controlSize: "expanded" as const,
		contentRatio: 0.3,
		showLabels: true,
		enableGestures: true,
	},
	desktop: {
		layout: "split" as const,
		controlSize: "expanded" as const,
		contentRatio: 0.25,
		showLabels: true,
		enableGestures: false,
	},
};

export const ResponsiveAnimationInterface: React.FC<
	ResponsiveAnimationInterfaceProps
> = ({
	sequenceId,
	onStepChange,
	onAnimationTrigger,
	className = "",
	autoPlay = false,
	showEducationalContent = true,
	enableAudio = true,
	config = {},
	children,
}) => {
	const mobileConfig = { ...DEFAULT_MOBILE_ANIMATION_CONFIG, ...config };

	const [screenMetrics, setScreenMetrics] = useState<ScreenMetrics>({
		width: typeof window !== "undefined" ? window.innerWidth : 1024,
		height: typeof window !== "undefined" ? window.innerHeight : 768,
		orientation: "landscape",
		deviceType: "desktop",
		pixelRatio:
			typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
		touchPoints: 0,
	});

	const [layout, setLayout] = useState<AdaptiveLayout>(LAYOUT_PRESETS.desktop);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [splitView, setSplitView] = useState(false);

	// Screen metrics detection
	const detectScreenMetrics = useCallback(() => {
		if (typeof window === "undefined") return;

		const width = window.innerWidth;
		const height = window.innerHeight;
		const orientation = width >= height ? "landscape" : "portrait";
		const pixelRatio = window.devicePixelRatio || 1;

		// Device type detection
		let deviceType: ScreenMetrics["deviceType"] = "desktop";
		if (width < 768 || "ontouchstart" in window) {
			deviceType = "mobile";
		} else if (width < 1024) {
			deviceType = "tablet";
		}

		// Touch points detection
		const touchPoints =
			"ontouchstart" in window ? (navigator as any).maxTouchPoints || 1 : 0;

		setScreenMetrics({
			width,
			height,
			orientation,
			deviceType,
			pixelRatio,
			touchPoints,
		});
	}, []);

	// Adaptive layout calculation
	const calculateAdaptiveLayout = useCallback(
		(metrics: ScreenMetrics): AdaptiveLayout => {
			const { width, height, orientation, deviceType } = metrics;

			// Base layout selection
			let preset = LAYOUT_PRESETS.desktop;

			if (deviceType === "mobile") {
				preset =
					orientation === "portrait"
						? LAYOUT_PRESETS.mobilePortrait
						: LAYOUT_PRESETS.mobileLandscape;
			} else if (deviceType === "tablet") {
				preset =
					orientation === "portrait"
						? LAYOUT_PRESETS.tabletPortrait
						: LAYOUT_PRESETS.tabletLandscape;
			}

			// Adjust for very small screens
			if (width < 400) {
				return {
					...preset,
					controlSize: "compact",
					contentRatio: 0.7,
				};
			}

			// Adjust for very large screens
			if (width > 1920) {
				return {
					...preset,
					controlSize: "expanded",
					contentRatio: 0.2,
				};
			}

			return preset;
		},
		[],
	);

	// Update layout based on screen metrics
	useEffect(() => {
		const newLayout = calculateAdaptiveLayout(screenMetrics);
		setLayout(newLayout);
	}, [screenMetrics, calculateAdaptiveLayout]);

	// Handle screen resize/orientation change
	useEffect(() => {
		detectScreenMetrics();

		const handleResize = () => {
			detectScreenMetrics();

			// Auto-hide controls on mobile orientation change
			if (screenMetrics.deviceType === "mobile") {
				setTimeout(() => setShowControls(false), 2000);
			}
		};

		window.addEventListener("resize", handleResize);
		window.addEventListener("orientationchange", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("orientationchange", handleResize);
		};
	}, [detectScreenMetrics, screenMetrics.deviceType]);

	// Gesture callbacks for layout control
	const gestureCallbacks: GestureCallbacks = {
		onSwipe: (gesture) => {
			if (gesture.direction === "up" && gesture.velocity > 0.5) {
				setShowControls(!showControls);
			}
		},

		onPinch: (gesture) => {
			if (gesture.scale > 1.2) {
				setIsFullscreen(true);
			} else if (gesture.scale < 0.8) {
				setIsFullscreen(false);
			}
		},

		onTap: (gesture) => {
			if (gesture.tapCount === 3) {
				setSplitView(!splitView);
			}
		},
	};

	const { touchHandlers } = useAdvancedTouchGestures(gestureCallbacks, {
		enabled: layout.enableGestures,
	});

	const toggleFullscreen = useCallback(() => {
		setIsFullscreen(!isFullscreen);
	}, [isFullscreen]);

	const toggleControls = useCallback(() => {
		setShowControls(!showControls);
	}, [showControls]);

	const toggleSplitView = useCallback(() => {
		setSplitView(!splitView);
	}, [splitView]);

	// Dynamic styling based on layout
	const getContainerStyle = (): React.CSSProperties => {
		if (isFullscreen) {
			return {
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				zIndex: 9999,
				backgroundColor: "#000",
			};
		}

		return {};
	};

	const getContentAreaStyle = (): React.CSSProperties => {
		if (layout.layout === "fullscreen") {
			return {
				height: "100vh",
				width: "100vw",
			};
		}

		if (layout.layout === "split") {
			const controlHeight =
				layout.controlSize === "compact"
					? "200px"
					: layout.controlSize === "normal"
						? "300px"
						: "400px";

			return {
				height: `calc(100vh - ${controlHeight})`,
				width: splitView ? `${100 - layout.contentRatio * 100}%` : "100%",
			};
		}

		return {
			height: "60vh",
			width: "100%",
		};
	};

	const getControlAreaStyle = (): React.CSSProperties => {
		if (layout.layout === "overlay" && !showControls) {
			return {
				opacity: 0,
				pointerEvents: "none",
			};
		}

		if (layout.layout === "split") {
			const controlHeight =
				layout.controlSize === "compact"
					? "200px"
					: layout.controlSize === "normal"
						? "300px"
						: "400px";

			return {
				height: controlHeight,
				width: splitView ? `${layout.contentRatio * 100}%` : "100%",
				transition: "all 0.3s ease",
			};
		}

		return {
			width: "100%",
		};
	};

	return (
		<div
			className={`responsive-animation-interface ${className}`}
			style={getContainerStyle()}
			{...touchHandlers}
		>
			{/* Screen Info Bar - Debug/Info */}
			<div className="fixed top-2 left-2 z-50 flex gap-1">
				<Badge
					variant="outline"
					className="border-white/20 bg-black/50 text-white text-xs"
				>
					<Smartphone className="mr-1 h-3 w-3" />
					{screenMetrics.deviceType}
				</Badge>
				<Badge
					variant="outline"
					className="border-white/20 bg-black/50 text-white text-xs"
				>
					<RotateCw className="mr-1 h-3 w-3" />
					{screenMetrics.orientation}
				</Badge>
				<Badge
					variant="outline"
					className="border-white/20 bg-black/50 text-white text-xs"
				>
					{screenMetrics.width}×{screenMetrics.height}
				</Badge>
			</div>

			{/* Layout Control Buttons */}
			<div className="fixed top-2 right-2 z-50 flex gap-1">
				<Button
					size="sm"
					variant="outline"
					onClick={toggleControls}
					className="border-white/20 bg-black/50 text-white hover:bg-black/70"
				>
					{showControls ? (
						<EyeOff className="h-4 w-4" />
					) : (
						<Eye className="h-4 w-4" />
					)}
				</Button>

				<Button
					size="sm"
					variant="outline"
					onClick={toggleSplitView}
					className="border-white/20 bg-black/50 text-white hover:bg-black/70"
				>
					<Split className="h-4 w-4" />
				</Button>

				<Button
					size="sm"
					variant="outline"
					onClick={toggleFullscreen}
					className="border-white/20 bg-black/50 text-white hover:bg-black/70"
				>
					{isFullscreen ? (
						<Minimize2 className="h-4 w-4" />
					) : (
						<Maximize2 className="h-4 w-4" />
					)}
				</Button>
			</div>

			{/* Main Content Area */}
			<div className="relative" style={getContentAreaStyle()}>
				{/* 3D Animation Content */}
				<div className="h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-gray-800">
					{children || (
						<div className="flex h-full w-full items-center justify-center text-white">
							<div className="text-center">
								<Activity className="mx-auto mb-4 h-16 w-16 opacity-50" />
								<h3 className="mb-2 font-medium text-lg">Animacja 3D</h3>
								<p className="text-sm opacity-75">
									{screenMetrics.deviceType === "mobile"
										? "Dotknij, aby sterować animacją"
										: "Użyj gestów lub kontrolek poniżej"}
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Educational Content Overlay */}
				{showEducationalContent && layout.layout === "overlay" && (
					<Card className="absolute right-4 bottom-4 left-4 border-white/20 bg-black/80 text-white">
						<CardContent className="p-3">
							<div className="flex items-center gap-2 text-sm">
								<BookOpen className="h-4 w-4" />
								<span>
									Zawartość edukacyjna - przesuń w górę, aby ukryć kontrolki
								</span>
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Control Area */}
			<div
				className={`transition-all duration-300 ${!showControls ? "pointer-events-none opacity-0" : "opacity-100"}`}
				style={getControlAreaStyle()}
			>
				{layout.layout === "split" && splitView ? (
					/* Split View Layout */
					<div className="flex h-full">
						{/* Animation Content (Left side) */}
						<div className="flex-1 p-4">
							<Card className="h-full">
								<CardContent className="flex h-full items-center justify-center p-4">
									<div className="text-center text-gray-500">
										<Activity className="mx-auto mb-2 h-12 w-12" />
										<p className="text-sm">Animacja 3D</p>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Controls (Right side) */}
						<div className="w-1/3 p-4">
							<MobileAnimationControls
								sequenceId={sequenceId}
								onStepChange={onStepChange}
								onAnimationTrigger={onAnimationTrigger}
								autoPlay={autoPlay}
								showEducationalContent={showEducationalContent}
								enableAudio={enableAudio}
								config={config}
							/>
						</div>
					</div>
				) : (
					/* Standard Layout */
					<div className="p-4">
						<MobileAnimationControls
							sequenceId={sequenceId}
							onStepChange={onStepChange}
							onAnimationTrigger={onAnimationTrigger}
							autoPlay={autoPlay}
							showEducationalContent={showEducationalContent}
							enableAudio={enableAudio}
							config={config}
						/>
					</div>
				)}
			</div>

			{/* Mobile Bottom Safe Area */}
			{screenMetrics.deviceType === "mobile" && (
				<div className="h-safe-area-inset-bottom" />
			)}

			{/* Performance Indicator */}
			<div className="fixed bottom-2 left-2 z-50">
				<Badge
					variant="outline"
					className={`text-xs ${
						screenMetrics.pixelRatio > 2
							? "border-red-400 bg-red-500/50 text-white"
							: screenMetrics.pixelRatio > 1.5
								? "border-yellow-400 bg-yellow-500/50 text-white"
								: "border-green-400 bg-green-500/50 text-white"
					}`}
				>
					{screenMetrics.pixelRatio.toFixed(1)}x DPR
				</Badge>
			</div>
		</div>
	);
};
