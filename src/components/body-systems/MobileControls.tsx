"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	Home,
	Maximize2,
	Minimize2,
	Pause,
	Play,
	RotateCw,
	Volume2,
	VolumeX,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { useEffect, useState } from "react";

interface MobileControlsProps {
	isVisible: boolean;
	animationSpeed: number;
	isPlaying: boolean;
	showLabels: boolean;
	enableAudio: boolean;
	onAnimationSpeedChange: (speed: number) => void;
	onPlayPause: () => void;
	onToggleLabels: () => void;
	onToggleAudio: () => void;
	onResetView: () => void;
	onFullscreenToggle: () => void;
	className?: string;
}

// Touch-friendly control button component
const TouchButton: React.FC<{
	onClick: () => void;
	disabled?: boolean;
	children: React.ReactNode;
	variant?: "default" | "outline" | "ghost";
	size?: "sm" | "default" | "lg";
	className?: string;
}> = ({
	onClick,
	disabled = false,
	children,
	variant = "outline",
	size = "default",
	className = "",
}) => {
	return (
		<Button
			onClick={onClick}
			disabled={disabled}
			variant={variant}
			size={size}
			className={`min-h-[44px] min-w-[44px] touch-manipulation ${className}`}
		>
			{children}
		</Button>
	);
};

// Joystick-style navigation component for touch devices
const TouchJoystick: React.FC<{
	onMove: (deltaX: number, deltaY: number) => void;
	onCenter: () => void;
	size?: number;
	className?: string;
}> = ({ onMove, onCenter, size = 120, className = "" }) => {
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

	const handleStart = (clientX: number, clientY: number) => {
		setIsDragging(true);
		setDragStart({ x: clientX, y: clientY });
	};

	const handleMove = (clientX: number, clientY: number) => {
		if (!isDragging) return;

		const deltaX = (clientX - dragStart.x) / (size / 2);
		const deltaY = (clientY - dragStart.y) / (size / 2);

		// Clamp values between -1 and 1
		const clampedDeltaX = Math.max(-1, Math.min(1, deltaX));
		const clampedDeltaY = Math.max(-1, Math.min(1, deltaY));

		onMove(clampedDeltaX, clampedDeltaY);
	};

	const handleEnd = () => {
		setIsDragging(false);
		onCenter();
	};

	useEffect(() => {
		const handleTouchStart = (e: TouchEvent) => {
			e.preventDefault();
			const touch = e.touches[0];
			handleStart(touch.clientX, touch.clientY);
		};

		const handleTouchMove = (e: TouchEvent) => {
			e.preventDefault();
			const touch = e.touches[0];
			handleMove(touch.clientX, touch.clientY);
		};

		const handleTouchEnd = (e: TouchEvent) => {
			e.preventDefault();
			handleEnd();
		};

		const handleMouseDown = (e: MouseEvent) => {
			handleStart(e.clientX, e.clientY);
		};

		const handleMouseMove = (e: MouseEvent) => {
			handleMove(e.clientX, e.clientY);
		};

		const handleMouseUp = () => {
			handleEnd();
		};

		if (typeof window !== "undefined") {
			document.addEventListener("touchstart", handleTouchStart, {
				passive: false,
			});
			document.addEventListener("touchmove", handleTouchMove, {
				passive: false,
			});
			document.addEventListener("touchend", handleTouchEnd, { passive: false });
			document.addEventListener("mousedown", handleMouseDown);
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);

			return () => {
				document.removeEventListener("touchstart", handleTouchStart);
				document.removeEventListener("touchmove", handleTouchMove);
				document.removeEventListener("touchend", handleTouchEnd);
				document.removeEventListener("mousedown", handleMouseDown);
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}
	}, [isDragging, dragStart, size]);

	return (
		<div
			className={`relative touch-manipulation rounded-full border-2 border-gray-300 bg-gray-100/20 ${className}`}
			style={{ width: size, height: size }}
		>
			{/* Joystick background */}
			<div className="absolute inset-2 rounded-full bg-gray-200/50" />

			{/* Joystick knob */}
			<div
				className={`absolute rounded-full bg-blue-500 shadow-lg transition-transform ${
					isDragging ? "scale-75" : "scale-100"
				}`}
				style={{
					width: size * 0.3,
					height: size * 0.3,
					left: "50%",
					top: "50%",
					transform: "translate(-50%, -50%)",
				}}
			/>

			{/* Center indicator */}
			<div className="-translate-x-1/2 -translate-y-1/2 absolute inset-1/2 h-1 w-1 transform rounded-full bg-gray-400" />
		</div>
	);
};

// Main mobile controls component
export const MobileControls: React.FC<MobileControlsProps> = ({
	isVisible,
	animationSpeed,
	isPlaying,
	showLabels,
	enableAudio,
	onAnimationSpeedChange,
	onPlayPause,
	onToggleLabels,
	onToggleAudio,
	onResetView,
	onFullscreenToggle,
	className = "",
}) => {
	const [showAdvanced, setShowAdvanced] = useState(false);

	if (!isVisible) return null;

	return (
		<div className={`fixed right-4 bottom-4 left-4 z-40 ${className}`}>
			<Card className="bg-white/95 backdrop-blur-sm">
				<CardContent className="p-4">
					{/* Main control row */}
					<div className="mb-4 flex items-center justify-center gap-4">
						{/* Play/Pause */}
						<TouchButton onClick={onPlayPause} size="lg">
							{isPlaying ? (
								<Pause className="h-5 w-5" />
							) : (
								<Play className="h-5 w-5" />
							)}
						</TouchButton>

						{/* Reset view */}
						<TouchButton onClick={onResetView} size="lg">
							<Home className="h-5 w-5" />
						</TouchButton>

						{/* Fullscreen toggle */}
						<TouchButton onClick={onFullscreenToggle} size="lg">
							<Maximize2 className="h-5 w-5" />
						</TouchButton>
					</div>

					{/* Secondary controls */}
					<div className="mb-4 flex items-center justify-center gap-3">
						{/* Labels toggle */}
						<Button
							variant={showLabels ? "default" : "outline"}
							size="sm"
							onClick={onToggleLabels}
							className="min-h-[40px] touch-manipulation"
						>
							Etykiety
						</Button>

						{/* Audio toggle */}
						<Button
							variant={enableAudio ? "default" : "outline"}
							size="sm"
							onClick={onToggleAudio}
							className="min-h-[40px] touch-manipulation"
						>
							{enableAudio ? (
								<Volume2 className="h-4 w-4" />
							) : (
								<VolumeX className="h-4 w-4" />
							)}
						</Button>

						{/* Advanced controls toggle */}
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowAdvanced(!showAdvanced)}
							className="min-h-[40px] touch-manipulation"
						>
							Zaawansowane
						</Button>
					</div>

					{/* Advanced controls panel */}
					{showAdvanced && (
						<div className="space-y-4 border-t pt-4">
							{/* Animation speed control */}
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="font-medium text-sm">Prędkość animacji</span>
									<Badge variant="outline">{animationSpeed.toFixed(1)}x</Badge>
								</div>
								<Slider
									value={[animationSpeed]}
									onValueChange={([value]) =>
										onAnimationSpeedChange(value || 1)
									}
									min={0.1}
									max={3}
									step={0.1}
									className="touch-manipulation"
								/>
							</div>

							{/* Quick action buttons */}
							<div className="grid grid-cols-2 gap-2">
								<Button
									variant="outline"
									size="sm"
									className="min-h-[40px] touch-manipulation"
								>
									<ZoomIn className="mr-1 h-4 w-4" />
									Przybliż
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="min-h-[40px] touch-manipulation"
								>
									<ZoomOut className="mr-1 h-4 w-4" />
									Oddal
								</Button>
							</div>

							{/* Navigation hint */}
							<div className="rounded bg-gray-50 py-2 text-center text-gray-600 text-xs">
								💡 Użyj dwóch palców do obracania i powiększania
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

// Hook for detecting mobile devices
export const useMobileDetection = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return isMobile;
};

// Touch gesture handler component
export const TouchGestureHandler: React.FC<{
	onPinch?: (scale: number) => void;
	onRotate?: (rotation: number) => void;
	onPan?: (deltaX: number, deltaY: number) => void;
	children: React.ReactNode;
}> = ({ onPinch, onRotate, onPan, children }) => {
	const [lastPinchDistance, setLastPinchDistance] = useState<number | null>(
		null,
	);
	const [initialRotation, setInitialRotation] = useState<number | null>(null);

	useEffect(() => {
		const handleTouchStart = (e: TouchEvent) => {
			if (e.touches.length === 2) {
				// Pinch gesture start
				const distance = Math.sqrt(
					(e.touches[0].clientX - e.touches[1].clientX) ** 2 +
						(e.touches[0].clientY - e.touches[1].clientY) ** 2,
				);
				setLastPinchDistance(distance);

				// Rotation gesture start
				const angle = Math.atan2(
					e.touches[1].clientY - e.touches[0].clientY,
					e.touches[1].clientX - e.touches[0].clientX,
				);
				setInitialRotation(angle);
			}
		};

		const handleTouchMove = (e: TouchEvent) => {
			e.preventDefault();

			if (
				e.touches.length === 2 &&
				lastPinchDistance &&
				initialRotation !== null
			) {
				// Pinch gesture
				const distance = Math.sqrt(
					(e.touches[0].clientX - e.touches[1].clientX) ** 2 +
						(e.touches[0].clientY - e.touches[1].clientY) ** 2,
				);

				const scale = distance / lastPinchDistance;
				onPinch?.(scale);

				// Rotation gesture
				const angle = Math.atan2(
					e.touches[1].clientY - e.touches[0].clientY,
					e.touches[1].clientX - e.touches[0].clientX,
				);

				const rotation = angle - initialRotation;
				onRotate?.(rotation);
			} else if (e.touches.length === 1) {
				// Pan gesture
				const deltaX = e.touches[0].clientX - (e.touches[0].clientX - 1);
				const deltaY = e.touches[0].clientY - (e.touches[0].clientY - 1);
				onPan?.(deltaX, deltaY);
			}
		};

		const handleTouchEnd = () => {
			setLastPinchDistance(null);
			setInitialRotation(null);
		};

		document.addEventListener("touchstart", handleTouchStart, {
			passive: false,
		});
		document.addEventListener("touchmove", handleTouchMove, { passive: false });
		document.addEventListener("touchend", handleTouchEnd);

		return () => {
			document.removeEventListener("touchstart", handleTouchStart);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleTouchEnd);
		};
	}, [lastPinchDistance, initialRotation, onPinch, onRotate, onPan]);

	return <>{children}</>;
};
