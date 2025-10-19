"use client";

import {
	AnimationFrame,
	type CameraPath,
	type CameraWaypoint,
	type TransitionEasing,
	type Vector3D,
	type WebGLContext,
} from "@/lib/types/transitions";
import { useCallback, useEffect, useRef, useState } from "react";

interface CameraPathAnimatorProps {
	cameraPath: CameraPath;
	onProgress?: (progress: number) => void;
	onComplete?: () => void;
	onWaypoint?: (waypoint: CameraWaypoint, index: number) => void;
	webglContext?: WebGLContext | null;
	autoStart?: boolean;
	loop?: boolean;
}

interface CameraState {
	position: Vector3D;
	rotation: Vector3D;
	zoom: number;
	velocity: Vector3D;
	angularVelocity: Vector3D;
}

export class CameraPathAnimator {
	private currentWaypointIndex = 0;
	private animationId: number | null = null;
	private startTime = 0;
	private isAnimating = false;
	private currentState: CameraState;
	private targetState: CameraState;
	private animationManager: any; // Will be injected

	constructor(
		private cameraPath: CameraPath,
		animationManager?: any,
	) {
		this.animationManager = animationManager;

		// Initialize camera state
		this.currentState = {
			position: {
				...(this.cameraPath.waypoints[0]?.position || { x: 0, y: 0, z: 5 }),
			},
			rotation: {
				...(this.cameraPath.waypoints[0]?.rotation || { x: 0, y: 0, z: 0 }),
			},
			zoom: this.cameraPath.waypoints[0]?.zoom || 1,
			velocity: { x: 0, y: 0, z: 0 },
			angularVelocity: { x: 0, y: 0, z: 0 },
		};

		this.targetState = { ...this.currentState };
	}

	start(): Promise<void> {
		return new Promise((resolve) => {
			if (this.isAnimating) {
				resolve();
				return;
			}

			this.isAnimating = true;
			this.startTime = performance.now();
			this.currentWaypointIndex = 0;

			const animate = (currentTime: number) => {
				const elapsed = currentTime - this.startTime;
				const progress = this.updateCameraPosition(elapsed);

				if (progress >= 1) {
					this.isAnimating = false;
					resolve();
				} else {
					this.animationId = requestAnimationFrame(animate);
				}
			};

			this.animationId = requestAnimationFrame(animate);
		});
	}

	stop(): void {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
		this.isAnimating = false;
	}

	getProgress(): number {
		if (!this.isAnimating || this.cameraPath.waypoints.length === 0) {
			return 0;
		}

		const totalDuration = this.cameraPath.waypoints.reduce(
			(sum, waypoint) => sum + waypoint.duration,
			0,
		);

		const elapsed = performance.now() - this.startTime;
		return Math.min(elapsed / totalDuration, 1);
	}

	getCurrentState(): CameraState {
		return { ...this.currentState };
	}

	setTarget(position: Vector3D, rotation: Vector3D, zoom: number): void {
		this.targetState = {
			position: { ...position },
			rotation: { ...rotation },
			zoom,
			velocity: { x: 0, y: 0, z: 0 },
			angularVelocity: { x: 0, y: 0, z: 0 },
		};
	}

	private updateCameraPosition(elapsedTime: number): number {
		if (this.cameraPath.waypoints.length === 0) {
			return 1;
		}

		let totalProgress = 0;
		let currentWaypoint: CameraWaypoint | null = null;
		let nextWaypoint: CameraWaypoint | null = null;

		// Find current waypoint segment
		let accumulatedTime = 0;
		for (let i = 0; i < this.cameraPath.waypoints.length; i++) {
			const waypoint = this.cameraPath.waypoints[i];
			accumulatedTime += waypoint.duration;

			if (elapsedTime <= accumulatedTime) {
				currentWaypoint = waypoint;
				nextWaypoint = this.cameraPath.waypoints[i + 1] || waypoint;
				totalProgress =
					(elapsedTime - (accumulatedTime - waypoint.duration)) /
					waypoint.duration;
				break;
			}
		}

		if (!currentWaypoint) {
			return 1;
		}

		// Apply easing
		const easedProgress = this.applyEasing(
			totalProgress,
			currentWaypoint.easing,
		);

		// Interpolate position
		this.currentState.position = this.interpolateVector3D(
			currentWaypoint.position,
			nextWaypoint.position,
			easedProgress,
		);

		// Interpolate rotation
		this.currentState.rotation = this.interpolateVector3D(
			currentWaypoint.rotation,
			nextWaypoint.rotation,
			easedProgress,
		);

		// Interpolate zoom
		this.currentState.zoom = this.interpolateFloat(
			currentWaypoint.zoom,
			nextWaypoint.zoom,
			easedProgress,
		);

		// Apply camera path type modifications
		this.applyCameraPathType(easedProgress, currentWaypoint);

		return totalProgress;
	}

	private applyEasing(t: number, easing: TransitionEasing): number {
		switch (easing) {
			case "linear":
				return t;
			case "easeIn":
				return t * t;
			case "easeOut":
				return t * (2 - t);
			case "easeInOut":
				return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
			case "easeInCubic":
				return t * t * t;
			case "easeOutCubic":
				return --t * t * t + 1;
			case "easeInOutCubic":
				return t < 0.5
					? 4 * t * t * t
					: (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
			case "easeInQuart":
				return t * t * t * t;
			case "easeOutQuart":
				return 1 - --t * t * t * t;
			case "easeInOutQuart":
				return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
			case "easeInSine":
				return 1 - Math.cos((t * Math.PI) / 2);
			case "easeOutSine":
				return Math.sin((t * Math.PI) / 2);
			case "easeInOutSine":
				return -(Math.cos(Math.PI * t) - 1) / 2;
			default:
				return t;
		}
	}

	private interpolateVector3D(
		from: Vector3D,
		to: Vector3D,
		t: number,
	): Vector3D {
		return {
			x: from.x + (to.x - from.x) * t,
			y: from.y + (to.y - from.y) * t,
			z: from.z + (to.z - from.z) * t,
		};
	}

	private interpolateFloat(from: number, to: number, t: number): number {
		return from + (to - from) * t;
	}

	private applyCameraPathType(
		progress: number,
		waypoint: CameraWaypoint,
	): void {
		switch (this.cameraPath.type) {
			case "orbital":
				this.applyOrbitalMotion(progress, waypoint);
				break;
			case "spiral":
				this.applySpiralMotion(progress, waypoint);
				break;
			case "cinematic":
				this.applyCinematicMotion(progress, waypoint);
				break;
			case "curved":
				this.applyCurvedMotion(progress, waypoint);
				break;
		}
	}

	private applyOrbitalMotion(progress: number, waypoint: CameraWaypoint): void {
		const radius = 2;
		const angle = progress * Math.PI * 2;
		this.currentState.position.x = Math.cos(angle) * radius;
		this.currentState.position.z = Math.sin(angle) * radius;
		this.currentState.rotation.y = angle;
	}

	private applySpiralMotion(progress: number, waypoint: CameraWaypoint): void {
		const radius = 2 * (1 - progress);
		const angle = progress * Math.PI * 4;
		const height = progress * 2;

		this.currentState.position.x = Math.cos(angle) * radius;
		this.currentState.position.y = height;
		this.currentState.position.z = Math.sin(angle) * radius;
		this.currentState.rotation.y = angle;
	}

	private applyCinematicMotion(
		progress: number,
		waypoint: CameraWaypoint,
	): void {
		// Add subtle camera shake and smooth damping
		const shake = (Math.random() - 0.5) * 0.02 * (1 - progress);
		this.currentState.position.x += shake;
		this.currentState.position.y += shake * 0.5;

		// Apply smooth rotation based on camera path rotation settings
		const rotationProgress = progress * this.cameraPath.rotation.smoothness;
		this.currentState.rotation.x +=
			this.cameraPath.rotation.pitch * rotationProgress;
		this.currentState.rotation.y +=
			this.cameraPath.rotation.yaw * rotationProgress;
		this.currentState.rotation.z +=
			this.cameraPath.rotation.roll * rotationProgress;
	}

	private applyCurvedMotion(progress: number, waypoint: CameraWaypoint): void {
		// Create smooth curved paths using bezier interpolation
		const curvature = 0.5;
		const curvedProgress = Math.sin(progress * Math.PI) * curvature;

		this.currentState.position.y += curvedProgress;
		this.currentState.rotation.z += curvedProgress * 0.1;
	}
}

// React Hook for using CameraPathAnimator
export function useCameraPathAnimator(
	cameraPath: CameraPath,
	options: {
		autoStart?: boolean;
		loop?: boolean;
		onProgress?: (progress: number) => void;
		onComplete?: () => void;
		onWaypoint?: (waypoint: CameraWaypoint, index: number) => void;
	} = {},
) {
	const animatorRef = useRef<CameraPathAnimator | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [progress, setProgress] = useState(0);
	const [currentState, setCurrentState] = useState<CameraState | null>(null);

	const {
		autoStart = false,
		loop = false,
		onProgress,
		onComplete,
		onWaypoint,
	} = options;

	useEffect(() => {
		animatorRef.current = new CameraPathAnimator(cameraPath);

		if (autoStart) {
			startAnimation();
		}

		return () => {
			animatorRef.current?.stop();
		};
	}, [cameraPath]);

	const startAnimation = useCallback(async () => {
		if (!animatorRef.current) return;

		setIsAnimating(true);
		setProgress(0);

		try {
			await animatorRef.current.start();
			setIsAnimating(false);
			setProgress(1);
			onComplete?.();

			if (loop) {
				startAnimation();
			}
		} catch (error) {
			console.error("Camera animation error:", error);
			setIsAnimating(false);
		}
	}, [loop, onComplete]);

	const stopAnimation = useCallback(() => {
		animatorRef.current?.stop();
		setIsAnimating(false);
	}, []);

	// Update progress periodically
	useEffect(() => {
		if (!isAnimating || !animatorRef.current) return;

		const interval = setInterval(() => {
			const currentProgress = animatorRef.current?.getProgress();
			const state = animatorRef.current?.getCurrentState();

			setProgress(currentProgress);
			setCurrentState(state);

			onProgress?.(currentProgress);

			if (currentProgress >= 1) {
				clearInterval(interval);
			}
		}, 16); // ~60fps

		return () => clearInterval(interval);
	}, [isAnimating, onProgress]);

	return {
		startAnimation,
		stopAnimation,
		isAnimating,
		progress,
		currentState,
	};
}

// React Component for CameraPathAnimator
export function CameraPathAnimatorComponent({
	cameraPath,
	onProgress,
	onComplete,
	onWaypoint,
	webglContext,
	autoStart = false,
	loop = false,
	children,
}: CameraPathAnimatorProps & { children?: React.ReactNode }) {
	const { startAnimation, stopAnimation, isAnimating, progress, currentState } =
		useCameraPathAnimator(cameraPath, {
			autoStart,
			loop,
			onProgress,
			onComplete,
			onWaypoint,
		});

	// Provide camera state to children
	const childrenWithProps = children
		? React.Children.map(children, (child) =>
				React.isValidElement(child)
					? React.cloneElement(child as React.ReactElement<any>, {
							cameraState: currentState,
							cameraProgress: progress,
							isCameraAnimating: isAnimating,
							startCameraAnimation: startAnimation,
							stopCameraAnimation: stopAnimation,
						})
					: child,
			)
		: null;

	return <div className="camera-path-animator">{childrenWithProps}</div>;
}

// Utility functions for creating common camera paths
export const createCameraPaths = {
	// Simple linear transition between two points
	linear: (from: Vector3D, to: Vector3D, duration = 2000): CameraPath => ({
		type: "linear",
		waypoints: [
			{
				position: from,
				rotation: { x: 0, y: 0, z: 0 },
				zoom: 1,
				duration: duration / 2,
				easing: "easeOut",
			},
			{
				position: to,
				rotation: { x: 0, y: 0, z: 0 },
				zoom: 1,
				duration: duration / 2,
				easing: "easeIn",
			},
		],
		rotation: { pitch: 0, yaw: 0, roll: 0, smoothness: 0.8 },
		zoom: { start: 1, end: 1, smoothness: 0.5 },
	}),

	// Orbital path around a central point
	orbital: (center: Vector3D, radius = 2, duration = 3000): CameraPath => ({
		type: "orbital",
		waypoints: [
			{
				position: { x: center.x + radius, y: center.y, z: center.z },
				rotation: { x: 0, y: 0, z: 0 },
				zoom: 1,
				duration: duration,
				easing: "linear",
			},
		],
		rotation: { pitch: 0, yaw: 0, roll: 0, smoothness: 0.9 },
		zoom: { start: 1, end: 1, smoothness: 1.0 },
	}),

	// Cinematic reveal with dramatic angles
	cinematic: (target: Vector3D, duration = 2500): CameraPath => ({
		type: "cinematic",
		waypoints: [
			{
				position: { x: target.x, y: target.y + 3, z: target.z + 2 },
				rotation: { x: -0.5, y: 0, z: 0 },
				zoom: 0.8,
				duration: duration * 0.4,
				easing: "easeOut",
			},
			{
				position: { x: target.x + 1, y: target.y + 1, z: target.z + 1 },
				rotation: { x: -0.2, y: 0.3, z: 0 },
				zoom: 1.2,
				duration: duration * 0.6,
				easing: "easeInOut",
			},
		],
		rotation: { pitch: 0.2, yaw: 0.3, roll: 0, smoothness: 0.7 },
		zoom: { start: 0.8, end: 1.2, smoothness: 0.6 },
	}),

	// Spiral approach for dynamic entries
	spiral: (target: Vector3D, radius = 3, duration = 2000): CameraPath => ({
		type: "spiral",
		waypoints: [
			{
				position: { x: target.x, y: target.y, z: target.z + radius },
				rotation: { x: -0.3, y: 0, z: 0 },
				zoom: 0.5,
				duration: duration,
				easing: "easeInOut",
			},
		],
		rotation: { pitch: 0.3, yaw: 0, roll: 0, smoothness: 0.8 },
		zoom: { start: 0.5, end: 1.5, smoothness: 0.7 },
	}),

	// Smooth curved path for gentle transitions
	curved: (
		from: Vector3D,
		to: Vector3D,
		curveHeight = 1,
		duration = 2000,
	): CameraPath => ({
		type: "curved",
		waypoints: [
			{
				position: from,
				rotation: { x: 0, y: 0, z: 0 },
				zoom: 1,
				duration: duration / 2,
				easing: "easeOut",
			},
			{
				position: {
					x: (from.x + to.x) / 2,
					y: (from.y + to.y) / 2 + curveHeight,
					z: (from.z + to.z) / 2,
				},
				rotation: { x: 0, y: 0, z: 0 },
				zoom: 1,
				duration: duration / 2,
				easing: "easeIn",
			},
			{
				position: to,
				rotation: { x: 0, y: 0, z: 0 },
				zoom: 1,
				duration: duration / 2,
				easing: "easeIn",
			},
		],
		rotation: { pitch: 0, yaw: 0, roll: 0, smoothness: 0.9 },
		zoom: { start: 1, end: 1, smoothness: 1.0 },
	}),
};
