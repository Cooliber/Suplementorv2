/**
 * 3D Navigation Controls with Gesture Integration
 * Provides orbit, zoom, pan, rotation, and focus controls for 3D brain models
 */

import { type Camera, Euler, MathUtils, Vector3 } from "three";
import {
	type GestureEvent,
	type GestureNavigationConfig,
	GestureType,
	type NavigationState,
	type Point2D,
} from "../types/gestures";

export class GestureNavigationControls {
	private camera: Camera;
	private config: GestureNavigationConfig;
	private state: NavigationState;
	private isEnabled = true;

	// Animation and momentum
	private animationId: number | null = null;
	private lastUpdateTime = 0;
	private velocity: Point3D = { x: 0, y: 0, z: 0 };
	private angularVelocity: Point2D = { x: 0, y: 0 };

	// Gesture state
	private isGesturing = false;
	private gestureStartPosition: Point2D = { x: 0, y: 0 };
	private gestureStartCamera: { position: Point3D; target: Point3D } = {
		position: { x: 0, y: 0, z: 0 },
		target: { x: 0, y: 0, z: 0 },
	};

	// Constraints
	private readonly MIN_DISTANCE = 1;
	private readonly MAX_DISTANCE = 50;
	private readonly MIN_POLAR_ANGLE = 0;
	private readonly MAX_POLAR_ANGLE = Math.PI;

	constructor(
		camera: Camera,
		config: GestureNavigationConfig,
		initialState?: Partial<NavigationState>,
	) {
		this.camera = camera;
		this.config = config;
		this.state = {
			camera: {
				position: { x: 5, y: 2, z: 5 },
				target: { x: 0, y: 0, z: 0 },
				distance: 7,
				angle: { x: 0, y: Math.PI / 4 },
			},
			controls: {
				orbit: true,
				zoom: true,
				pan: true,
				rotate: true,
				focus: true,
			},
			constraints: {
				minDistance: this.MIN_DISTANCE,
				maxDistance: this.MAX_DISTANCE,
				minPolarAngle: this.MIN_POLAR_ANGLE,
				maxPolarAngle: this.MAX_POLAR_ANGLE,
				enableDamping: true,
				dampingFactor: 0.05,
			},
			...initialState,
		};

		this.updateCameraPosition();
	}

	/**
	 * Handle gesture events for navigation
	 */
	handleGesture(event: GestureEvent): void {
		if (!this.isEnabled) return;

		switch (event.type) {
			case "pan":
				this.handlePanGesture(event);
				break;
			case "pinch":
				this.handlePinchGesture(event);
				break;
			case "rotate":
				this.handleRotateGesture(event);
				break;
			case "tap":
				this.handleTapGesture(event);
				break;
			case "double-tap":
				this.handleDoubleTapGesture(event);
				break;
			case "swipe":
				this.handleSwipeGesture(event);
				break;
		}
	}

	/**
	 * Handle pan gestures for camera orbiting and panning
	 */
	private handlePanGesture(event: GestureEvent): void {
		if (!this.state.controls.orbit && !this.state.controls.pan) return;

		const { translation, velocity } = event.data;

		if (!translation || !velocity) return;

		if (event.state.isActive && !this.isGesturing) {
			this.startGesture(event);
		}

		if (this.isGesturing) {
			if (this.state.controls.orbit) {
				this.orbitCamera(translation, velocity);
			} else if (this.state.controls.pan) {
				this.panCamera(translation, velocity);
			}

			this.updateVelocity(translation, velocity);
		}

		if (!event.state.isActive) {
			this.endGesture();
		}
	}

	/**
	 * Handle pinch gestures for zooming
	 */
	private handlePinchGesture(event: GestureEvent): void {
		if (!this.state.controls.zoom) return;

		const { scale, scaleDelta, scaleVelocity, center } = event.data;

		if (scale === undefined || !center) return;

		if (event.state.isActive && !this.isGesturing) {
			this.startGesture(event);
		}

		if (this.isGesturing) {
			this.zoomCamera(scale, scaleVelocity || 0, center);
			this.velocity.z = scaleVelocity || 0;
		}

		if (!event.state.isActive) {
			this.endGesture();
		}
	}

	/**
	 * Handle rotation gestures for model rotation
	 */
	private handleRotateGesture(event: GestureEvent): void {
		if (!this.state.controls.rotate) return;

		const { rotation, rotationDelta, angularVelocity } = event.data;

		if (rotation === undefined || !angularVelocity) return;

		if (event.state.isActive && !this.isGesturing) {
			this.startGesture(event);
		}

		if (this.isGesturing) {
			this.rotateModel(rotation, angularVelocity);
			this.angularVelocity = angularVelocity;
		}

		if (!event.state.isActive) {
			this.endGesture();
		}
	}

	/**
	 * Handle tap gestures for focus/selection
	 */
	private handleTapGesture(event: GestureEvent): void {
		if (!this.state.controls.focus) return;

		const { center } = event.data;
		if (!center) return;

		this.focusOnPoint(center);
	}

	/**
	 * Handle double tap for reset/camera home
	 */
	private handleDoubleTapGesture(event: GestureEvent): void {
		this.resetCamera();
	}

	/**
	 * Handle swipe gestures for quick navigation
	 */
	private handleSwipeGesture(event: GestureEvent): void {
		const { swipeDirection, swipeVelocity } = event.data;

		if (!swipeDirection || !swipeVelocity) return;

		switch (swipeDirection) {
			case "up":
				this.quickZoom(-swipeVelocity * 0.1);
				break;
			case "down":
				this.quickZoom(swipeVelocity * 0.1);
				break;
			case "left":
				this.quickOrbit(-swipeVelocity * 0.01, 0);
				break;
			case "right":
				this.quickOrbit(swipeVelocity * 0.01, 0);
				break;
		}
	}

	/**
	 * Camera orbiting with gesture input
	 */
	private orbitCamera(translation: Point2D, velocity: Point2D): void {
		const sensitivity = this.config.sensitivity.orbit;

		// Convert screen translation to spherical coordinates
		const deltaAzimuth = translation.x * sensitivity;
		const deltaPolar = translation.y * sensitivity;

		// Apply rotation with constraints
		this.state.camera.angle.x = MathUtils.clamp(
			this.state.camera.angle.x + deltaPolar,
			this.state.constraints.minPolarAngle,
			this.state.constraints.maxPolarAngle,
		);

		this.state.camera.angle.y += deltaAzimuth;

		this.updateCameraPosition();
	}

	/**
	 * Camera panning with gesture input
	 */
	private panCamera(translation: Point2D, velocity: Point2D): void {
		const sensitivity = this.config.sensitivity.pan;
		const distance = this.state.camera.distance;

		// Convert screen translation to world coordinates
		const deltaX = -(translation.x * sensitivity) / distance;
		const deltaZ = -(translation.y * sensitivity) / distance;

		// Pan the target point
		this.state.camera.target.x += deltaX;
		this.state.camera.target.z += deltaZ;

		this.updateCameraPosition();
	}

	/**
	 * Camera zooming with gesture input
	 */
	private zoomCamera(scale: number, velocity: number, center: Point2D): void {
		const sensitivity = this.config.sensitivity.zoom;
		const zoomFactor = 1 - (scale - 1) * sensitivity;

		// Calculate new distance
		const newDistance = this.state.camera.distance * zoomFactor;

		// Apply constraints
		this.state.camera.distance = MathUtils.clamp(
			newDistance,
			this.state.constraints.minDistance,
			this.state.constraints.maxDistance,
		);

		// Optional: zoom towards center point
		if (this.config.sensitivity.zoom > 0) {
			this.zoomTowardsPoint(center, zoomFactor);
		}

		this.updateCameraPosition();
	}

	/**
	 * Model rotation with gesture input
	 */
	private rotateModel(rotation: number, angularVelocity: Point2D): void {
		// This would integrate with the brain model rotation
		// For now, we'll emit an event that the 3D scene can listen to
		const event = new CustomEvent("modelRotation", {
			detail: { rotation, angularVelocity },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Focus camera on a specific point
	 */
	private focusOnPoint(point: Point2D): void {
		// Convert screen coordinates to 3D world coordinates
		// This is a simplified version - in practice, you'd need raycasting
		const worldPoint = this.screenToWorld(point);

		// Animate camera to focus on the point
		this.animateToTarget(worldPoint, 1000); // 1 second animation
	}

	/**
	 * Quick zoom for swipe gestures
	 */
	private quickZoom(delta: number): void {
		const newDistance = MathUtils.clamp(
			this.state.camera.distance + delta,
			this.state.constraints.minDistance,
			this.state.constraints.maxDistance,
		);

		this.state.camera.distance = newDistance;
		this.updateCameraPosition();
	}

	/**
	 * Quick orbit for swipe gestures
	 */
	private quickOrbit(deltaAzimuth: number, deltaPolar: number): void {
		this.state.camera.angle.x = MathUtils.clamp(
			this.state.camera.angle.x + deltaPolar,
			this.state.constraints.minPolarAngle,
			this.state.constraints.maxPolarAngle,
		);

		this.state.camera.angle.y += deltaAzimuth;
		this.updateCameraPosition();
	}

	/**
	 * Reset camera to default position
	 */
	private resetCamera(): void {
		this.state.camera = {
			position: { x: 5, y: 2, z: 5 },
			target: { x: 0, y: 0, z: 0 },
			distance: 7,
			angle: { x: 0, y: Math.PI / 4 },
		};

		this.updateCameraPosition();
	}

	/**
	 * Zoom towards a specific screen point
	 */
	private zoomTowardsPoint(screenPoint: Point2D, zoomFactor: number): void {
		// Calculate the world point at the screen coordinates
		const worldPoint = this.screenToWorld(screenPoint);

		// Calculate the vector from camera to world point
		const cameraPosition = new Vector3(
			this.state.camera.position.x,
			this.state.camera.position.y,
			this.state.camera.position.z,
		);

		const targetVector = new Vector3(
			worldPoint.x - cameraPosition.x,
			worldPoint.y - cameraPosition.y,
			worldPoint.z - cameraPosition.z,
		);

		// Scale the vector based on zoom
		targetVector.multiplyScalar(1 - zoomFactor);

		// Update camera position
		this.state.camera.position = {
			x: worldPoint.x - targetVector.x,
			y: worldPoint.y - targetVector.y,
			z: worldPoint.z - targetVector.z,
		};

		this.updateCameraPosition();
	}

	/**
	 * Animate camera to a target position
	 */
	private animateToTarget(target: Point3D, duration: number): void {
		const startPosition = { ...this.state.camera.position };
		const startTarget = { ...this.state.camera.target };
		const startTime = Date.now();

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Use easing function
			const easeProgress = this.easeInOutCubic(progress);

			// Interpolate position and target
			this.state.camera.position = {
				x: startPosition.x + (target.x - startPosition.x) * easeProgress,
				y: startPosition.y + (target.y - startPosition.y) * easeProgress,
				z: startPosition.z + (target.z - startPosition.z) * easeProgress,
			};

			this.state.camera.target = {
				x: startTarget.x + (target.x - startTarget.x) * easeProgress,
				y: startTarget.y + (target.y - startTarget.y) * easeProgress,
				z: startTarget.z + (target.z - startTarget.z) * easeProgress,
			};

			this.updateCameraPosition();

			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	}

	/**
	 * Convert screen coordinates to world coordinates
	 */
	private screenToWorld(screenPoint: Point2D): Point3D {
		// Simplified conversion - in practice, you'd use Three.js raycasting
		const distance = this.state.camera.distance;
		const azimuth = this.state.camera.angle.y;
		const polar = this.state.camera.angle.x;

		// Convert spherical to Cartesian coordinates
		const x = distance * Math.sin(polar) * Math.cos(azimuth);
		const y = distance * Math.cos(polar);
		const z = distance * Math.sin(polar) * Math.sin(azimuth);

		return { x, y, z };
	}

	/**
	 * Update camera position based on current state
	 */
	private updateCameraPosition(): void {
		const { distance, angle, target } = this.state.camera;

		// Convert spherical coordinates to Cartesian
		const position: Point3D = {
			x: distance * Math.sin(angle.x) * Math.cos(angle.y) + target.x,
			y: distance * Math.cos(angle.x) + target.y,
			z: distance * Math.sin(angle.x) * Math.sin(angle.y) + target.z,
		};

		this.state.camera.position = position;

		// Update the actual Three.js camera
		if (this.camera) {
			this.camera.position.set(position.x, position.y, position.z);

			if ("lookAt" in this.camera) {
				this.camera.lookAt(target.x, target.y, target.z);
			}
		}
	}

	/**
	 * Gesture lifecycle management
	 */
	private startGesture(event: GestureEvent): void {
		this.isGesturing = true;
		this.gestureStartPosition = event.data.center || { x: 0, y: 0 };
		this.gestureStartCamera = {
			position: { ...this.state.camera.position },
			target: { ...this.state.camera.target },
		};
		this.velocity = { x: 0, y: 0, z: 0 };
		this.angularVelocity = { x: 0, y: 0 };
	}

	private updateVelocity(translation: Point2D, velocity: Point2D): void {
		if (this.config.momentum.enabled) {
			this.velocity.x = velocity.x * this.config.momentum.friction;
			this.velocity.y = velocity.y * this.config.momentum.friction;
		}
	}

	private endGesture(): void {
		this.isGesturing = false;

		if (this.config.momentum.enabled) {
			this.startMomentumAnimation();
		}
	}

	/**
	 * Momentum-based animation after gesture ends
	 */
	private startMomentumAnimation(): void {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
		}

		const animate = (currentTime: number) => {
			if (this.lastUpdateTime === 0) {
				this.lastUpdateTime = currentTime;
				this.animationId = requestAnimationFrame(animate);
				return;
			}

			const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
			this.lastUpdateTime = currentTime;

			// Apply damping
			const damping = 1 - this.state.constraints.dampingFactor;

			this.velocity.x *= damping;
			this.velocity.y *= damping;
			this.velocity.z *= damping;

			this.angularVelocity.x *= damping;
			this.angularVelocity.y *= damping;

			// Stop animation if velocity is very small
			const totalVelocity =
				Math.abs(this.velocity.x) +
				Math.abs(this.velocity.y) +
				Math.abs(this.velocity.z) +
				Math.abs(this.angularVelocity.x) +
				Math.abs(this.angularVelocity.y);

			if (totalVelocity < 0.01) {
				return;
			}

			// Apply remaining velocity
			if (this.state.controls.orbit) {
				this.state.camera.angle.y += this.angularVelocity.x * deltaTime;
				this.state.camera.angle.x = MathUtils.clamp(
					this.state.camera.angle.x + this.angularVelocity.y * deltaTime,
					this.state.constraints.minPolarAngle,
					this.state.constraints.maxPolarAngle,
				);
			}

			if (this.state.controls.zoom && Math.abs(this.velocity.z) > 0.001) {
				this.state.camera.distance = MathUtils.clamp(
					this.state.camera.distance + this.velocity.z * deltaTime,
					this.state.constraints.minDistance,
					this.state.constraints.maxDistance,
				);
			}

			this.updateCameraPosition();

			this.animationId = requestAnimationFrame(animate);
		};

		this.animationId = requestAnimationFrame(animate);
	}

	/**
	 * Easing function for smooth animations
	 */
	private easeInOutCubic(t: number): number {
		return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
	}

	/**
	 * Enable or disable controls
	 */
	setEnabled(enabled: boolean): void {
		this.isEnabled = enabled;
	}

	/**
	 * Update configuration
	 */
	updateConfig(config: Partial<GestureNavigationConfig>): void {
		this.config = { ...this.config, ...config };
	}

	/**
	 * Update control states
	 */
	updateControls(controls: Partial<NavigationState["controls"]>): void {
		this.state.controls = { ...this.state.controls, ...controls };
	}

	/**
	 * Get current navigation state
	 */
	getState(): NavigationState {
		return { ...this.state };
	}

	/**
	 * Set camera position and target
	 */
	setCamera(position: Point3D, target: Point3D): void {
		this.state.camera.position = { ...position };
		this.state.camera.target = { ...target };
		this.state.camera.distance = Math.sqrt(
			(position.x - target.x) ** 2 +
				(position.y - target.y) ** 2 +
				(position.z - target.z) ** 2,
		);

		// Update angles based on position
		const offset = {
			x: position.x - target.x,
			y: position.y - target.y,
			z: position.z - target.z,
		};

		this.state.camera.angle = {
			x: Math.acos(offset.y / this.state.camera.distance),
			y: Math.atan2(offset.z, offset.x),
		};

		this.updateCameraPosition();
	}

	/**
	 * Dispose of resources
	 */
	dispose(): void {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
	}
}
