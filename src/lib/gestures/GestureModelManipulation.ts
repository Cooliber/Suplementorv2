/**
 * Interactive Model Manipulation with Gesture Controls
 * Handles organ selection, dissection, labeling, and multi-model comparison
 */

import {
	type Camera,
	type Group,
	Mesh,
	Object3D,
	Raycaster,
	type Vector3,
} from "three";
import {
	type BrainRegion,
	type GestureEvent,
	type GestureManipulationConfig,
	GestureType,
	type ManipulationState,
	type Point2D,
	SupplementEffect,
} from "../types/gestures";

export class GestureModelManipulation {
	private scene: Group;
	private camera: Camera;
	private config: GestureManipulationConfig;
	private state: ManipulationState;
	private brainRegions: BrainRegion[] = [];
	private raycaster: Raycaster;
	private selectedObjects: Object3D[] = [];
	private dissectionLayers: Map<string, Object3D[]> = new Map();
	private labelElements: Map<string, HTMLElement> = new Map();

	// Animation state
	private dissectionAnimations: Map<
		string,
		{ progress: number; startTime: number }
	> = new Map();
	private hoverTimeouts: Map<string, NodeJS.Timeout> = new Map();

	constructor(
		scene: Group,
		camera: Camera,
		brainRegions: BrainRegion[],
		config: GestureManipulationConfig,
	) {
		this.scene = scene;
		this.camera = camera;
		this.brainRegions = brainRegions;
		this.config = config;
		this.raycaster = new Raycaster();

		this.state = {
			selectedRegions: [],
			highlightedRegions: [],
			dissectedRegions: [],
			visibleLayers: ["surface"],
			transparency: {},
			dissection: {
				active: false,
				progress: 0,
				animationSpeed: 1,
			},
		};

		this.initializeDissectionLayers();
	}

	/**
	 * Handle gesture events for model manipulation
	 */
	handleGesture(event: GestureEvent): void {
		switch (event.type) {
			case "tap":
				this.handleTapGesture(event);
				break;
			case "long-press":
				this.handleLongPressGesture(event);
				break;
			case "pan":
				this.handlePanGesture(event);
				break;
			case "pinch":
				this.handlePinchGesture(event);
				break;
			case "rotate":
				this.handleRotateGesture(event);
				break;
			case "swipe":
				this.handleSwipeGesture(event);
				break;
			case "hover":
				this.handleHoverGesture(event);
				break;
		}
	}

	/**
	 * Handle tap gestures for region selection
	 */
	private handleTapGesture(event: GestureEvent): void {
		const { center } = event.data;
		if (!center) return;

		const selectedRegion = this.selectRegionAtPoint(center);

		if (selectedRegion) {
			if (this.config.selection.multiSelect && event.state.isActive) {
				this.toggleRegionSelection(selectedRegion.id);
			} else {
				this.selectRegion(selectedRegion.id);
			}

			this.showRegionLabel(selectedRegion.id);
		}
	}

	/**
	 * Handle long press for dissection mode
	 */
	private handleLongPressGesture(event: GestureEvent): void {
		const { center, pressure } = event.data;
		if (!center || !pressure) return;

		if (pressure > 0.7) {
			// High pressure threshold
			this.startDissectionMode(center);
		}
	}

	/**
	 * Handle pan gestures for multi-selection or dissection
	 */
	private handlePanGesture(event: GestureEvent): void {
		if (!this.state.dissection.active) return;

		const { translation } = event.data;
		if (!translation) return;

		this.updateDissectionProgress(translation);
	}

	/**
	 * Handle pinch gestures for layer visibility
	 */
	private handlePinchGesture(event: GestureEvent): void {
		const { scale, scaleDelta } = event.data;
		if (scale === undefined) return;

		if (Math.abs(scaleDelta) > 0.1) {
			this.adjustLayerTransparency(scale);
		}
	}

	/**
	 * Handle rotation gestures for model dissection
	 */
	private handleRotateGesture(event: GestureEvent): void {
		if (!this.state.dissection.active) return;

		const { rotation, rotationDelta } = event.data;
		if (rotation === undefined) return;

		this.rotateDissectionView(rotation);
	}

	/**
	 * Handle swipe gestures for layer navigation
	 */
	private handleSwipeGesture(event: GestureEvent): void {
		const { swipeDirection } = event.data;
		if (!swipeDirection) return;

		this.navigateLayers(swipeDirection);
	}

	/**
	 * Handle hover gestures for highlighting and tooltips
	 */
	private handleHoverGesture(event: GestureEvent): void {
		const { hoverPoint } = event.data;
		if (!hoverPoint) return;

		const region = this.selectRegionAtPoint(hoverPoint);

		if (region) {
			this.highlightRegion(region.id);

			if (this.config.labeling.showOnHover) {
				this.showRegionLabel(region.id);
			}
		} else {
			this.clearHighlights();
		}
	}

	/**
	 * Select brain region at screen point
	 */
	private selectRegionAtPoint(point: Point2D): BrainRegion | null {
		// Update raycaster with screen coordinates
		const rect = this.getCanvasRect();
		const normalizedPoint = {
			x: (point.x / rect.width) * 2 - 1,
			y: -(point.y / rect.height) * 2 + 1,
		};

		this.raycaster.setFromCamera(
			{ x: normalizedPoint.x, y: normalizedPoint.y } as Vector3,
			this.camera,
		);

		// Find intersections with brain region meshes
		const intersects = this.raycaster.intersectObjects(
			this.scene.children,
			true,
		);

		for (const intersect of intersects) {
			const regionId = this.findRegionByMesh(intersect.object);
			if (regionId) {
				return this.brainRegions.find((r) => r.id === regionId) || null;
			}
		}

		return null;
	}

	/**
	 * Find brain region ID by mesh object
	 */
	private findRegionByMesh(mesh: Object3D): string | null {
		// This would need to be implemented based on how regions are stored in the scene
		// For now, we'll use a simple name-based lookup
		if (mesh.userData?.regionId) {
			return mesh.userData.regionId;
		}

		// Fallback: check parent objects
		let parent = mesh.parent;
		while (parent) {
			if (parent.userData?.regionId) {
				return parent.userData.regionId;
			}
			parent = parent.parent;
		}

		return null;
	}

	/**
	 * Select a single brain region
	 */
	private selectRegion(regionId: string): void {
		this.state.selectedRegions = [regionId];
		this.state.highlightedRegions = [regionId];

		// Update visual selection
		this.updateRegionVisuals();

		// Emit selection event
		const event = new CustomEvent("regionSelected", {
			detail: { regionId, regions: this.state.selectedRegions },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Toggle region selection (for multi-select)
	 */
	private toggleRegionSelection(regionId: string): void {
		const index = this.state.selectedRegions.indexOf(regionId);

		if (index > -1) {
			this.state.selectedRegions.splice(index, 1);
		} else {
			this.state.selectedRegions.push(regionId);
		}

		this.state.highlightedRegions = [...this.state.selectedRegions];
		this.updateRegionVisuals();

		const event = new CustomEvent("regionSelectionToggled", {
			detail: { regionId, selectedRegions: this.state.selectedRegions },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Highlight a region (temporary visual feedback)
	 */
	private highlightRegion(regionId: string): void {
		if (!this.state.highlightedRegions.includes(regionId)) {
			this.state.highlightedRegions.push(regionId);
			this.updateRegionVisuals();
		}

		// Clear previous hover timeout
		const existingTimeout = this.hoverTimeouts.get(regionId);
		if (existingTimeout) {
			clearTimeout(existingTimeout);
		}

		// Set new hover timeout to clear highlight
		const timeout = setTimeout(() => {
			this.clearHighlight(regionId);
		}, 2000);

		this.hoverTimeouts.set(regionId, timeout);
	}

	/**
	 * Clear highlight for a specific region
	 */
	private clearHighlight(regionId: string): void {
		this.state.highlightedRegions = this.state.highlightedRegions.filter(
			(id) => id !== regionId,
		);
		this.updateRegionVisuals();
	}

	/**
	 * Clear all highlights
	 */
	private clearHighlights(): void {
		this.state.highlightedRegions = [];
		this.updateRegionVisuals();

		// Clear all hover timeouts
		for (const timeout of this.hoverTimeouts.values()) {
			clearTimeout(timeout);
		}
		this.hoverTimeouts.clear();
	}

	/**
	 * Show region label with Polish translation
	 */
	private showRegionLabel(regionId: string): void {
		const region = this.brainRegions.find((r) => r.id === regionId);
		if (!region) return;

		// Remove existing label
		this.hideRegionLabel(regionId);

		// Create label element
		const label = document.createElement("div");
		label.className = "brain-region-label";
		label.innerHTML = `
      <div class="bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium">
        <div class="font-bold">${region.polishName}</div>
        <div class="text-xs opacity-90">${region.name}</div>
      </div>
    `;

		// Position label (simplified positioning)
		label.style.position = "fixed";
		label.style.pointerEvents = "none";
		label.style.zIndex = "1000";
		label.style.transform = "translate(-50%, -100%)";

		// Add to DOM
		document.body.appendChild(label);
		this.labelElements.set(regionId, label);

		// Auto-hide after duration
		if (this.config.labeling.duration > 0) {
			setTimeout(() => {
				this.hideRegionLabel(regionId);
			}, this.config.labeling.duration);
		}
	}

	/**
	 * Hide region label
	 */
	private hideRegionLabel(regionId: string): void {
		const label = this.labelElements.get(regionId);
		if (label) {
			label.remove();
			this.labelElements.delete(regionId);
		}
	}

	/**
	 * Start dissection mode
	 */
	private startDissectionMode(center: Point2D): void {
		const region = this.selectRegionAtPoint(center);
		if (!region) return;

		this.state.dissection.active = true;
		this.state.dissection.progress = 0;

		// Start dissection animation
		this.animateDissection(region.id);

		const event = new CustomEvent("dissectionStarted", {
			detail: { regionId: region.id },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Update dissection progress during pan gesture
	 */
	private updateDissectionProgress(translation: Point2D): void {
		const progressDelta = (translation.x + translation.y) / 1000;
		this.state.dissection.progress = Math.max(
			0,
			Math.min(1, this.state.dissection.progress + progressDelta),
		);

		// Update visual dissection
		this.updateDissectionVisuals();
	}

	/**
	 * Animate dissection process
	 */
	private animateDissection(regionId: string): void {
		const startTime = Date.now();
		const duration = this.config.dissection.animationDuration;

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			this.state.dissection.progress = progress;
			this.updateDissectionVisuals();

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				this.completeDissection(regionId);
			}
		};

		requestAnimationFrame(animate);
	}

	/**
	 * Complete dissection and add to dissected regions
	 */
	private completeDissection(regionId: string): void {
		if (!this.state.dissectedRegions.includes(regionId)) {
			this.state.dissectedRegions.push(regionId);
		}

		this.state.dissection.active = false;
		this.state.dissection.progress = 0;

		this.updateDissectionVisuals();

		const event = new CustomEvent("dissectionCompleted", {
			detail: { regionId },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Rotate dissection view
	 */
	private rotateDissectionView(rotation: number): void {
		// Apply rotation to the scene or camera for better dissection view
		const event = new CustomEvent("dissectionViewRotated", {
			detail: { rotation },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Navigate through dissection layers
	 */
	private navigateLayers(direction: "up" | "down" | "left" | "right"): void {
		const currentIndex = this.config.dissection.layers.findIndex((layer) =>
			this.state.visibleLayers.includes(layer),
		);

		let newIndex = currentIndex;

		switch (direction) {
			case "up":
			case "left":
				newIndex = Math.max(0, currentIndex - 1);
				break;
			case "down":
			case "right":
				newIndex = Math.min(
					this.config.dissection.layers.length - 1,
					currentIndex + 1,
				);
				break;
		}

		if (newIndex !== currentIndex) {
			this.state.visibleLayers = [this.config.dissection.layers[newIndex]];
			this.updateLayerVisibility();
		}
	}

	/**
	 * Adjust layer transparency with pinch gesture
	 */
	private adjustLayerTransparency(scale: number): void {
		const currentLayer = this.state.visibleLayers[0];
		if (!currentLayer) return;

		const scaleChange = scale - 1;
		const transparencyChange = scaleChange * 0.1;

		const currentTransparency = this.state.transparency[currentLayer] || 0;
		const newTransparency = Math.max(
			0,
			Math.min(1, currentTransparency + transparencyChange),
		);

		this.state.transparency[currentLayer] = newTransparency;
		this.updateLayerTransparency();
	}

	/**
	 * Initialize dissection layers
	 */
	private initializeDissectionLayers(): void {
		// Group brain regions by anatomical layers
		this.dissectionLayers.set("surface", []);
		this.dissectionLayers.set("cortical", []);
		this.dissectionLayers.set("subcortical", []);
		this.dissectionLayers.set("brainstem", []);

		// This would need to be populated based on actual 3D model structure
		// For now, we'll use a simple categorization
		this.brainRegions.forEach((region) => {
			let layer = "surface";
			if (region.id.includes("cortex")) layer = "cortical";
			else if (
				region.id.includes("hippocampus") ||
				region.id.includes("amygdala")
			)
				layer = "subcortical";
			else if (region.id.includes("brainstem")) layer = "brainstem";

			if (!this.dissectionLayers.has(layer)) {
				this.dissectionLayers.set(layer, []);
			}
			this.dissectionLayers.get(layer)?.push(this.createRegionMesh(region));
		});
	}

	/**
	 * Create mesh for brain region (placeholder)
	 */
	private createRegionMesh(region: BrainRegion): Object3D {
		// This would create actual Three.js meshes for each region
		// For now, return a placeholder object
		const mesh = new Object3D();
		mesh.userData = { regionId: region.id };
		return mesh;
	}

	/**
	 * Update visual representation of regions
	 */
	private updateRegionVisuals(): void {
		// Update selection highlighting
		this.brainRegions.forEach((region) => {
			const isSelected = this.state.selectedRegions.includes(region.id);
			const isHighlighted = this.state.highlightedRegions.includes(region.id);

			// This would update the actual 3D mesh materials
			const event = new CustomEvent("regionVisualsUpdated", {
				detail: { regionId: region.id, isSelected, isHighlighted },
			});
			window.dispatchEvent(event);
		});
	}

	/**
	 * Update dissection visuals
	 */
	private updateDissectionVisuals(): void {
		this.state.dissectedRegions.forEach((regionId) => {
			const progress =
				this.state.dissection.active && this.state.dissection.progress > 0
					? this.state.dissection.progress
					: 1;

			const event = new CustomEvent("dissectionVisualsUpdated", {
				detail: { regionId, progress },
			});
			window.dispatchEvent(event);
		});
	}

	/**
	 * Update layer visibility
	 */
	private updateLayerVisibility(): void {
		this.dissectionLayers.forEach((meshes, layer) => {
			const isVisible = this.state.visibleLayers.includes(layer);

			const event = new CustomEvent("layerVisibilityUpdated", {
				detail: { layer, isVisible },
			});
			window.dispatchEvent(event);
		});
	}

	/**
	 * Update layer transparency
	 */
	private updateLayerTransparency(): void {
		this.state.visibleLayers.forEach((layer) => {
			const transparency = this.state.transparency[layer] || 0;

			const event = new CustomEvent("layerTransparencyUpdated", {
				detail: { layer, transparency },
			});
			window.dispatchEvent(event);
		});
	}

	/**
	 * Get canvas rectangle for coordinate conversion
	 */
	private getCanvasRect(): { width: number; height: number } {
		const canvas = document.querySelector("canvas");
		if (!canvas) {
			return { width: window.innerWidth, height: window.innerHeight };
		}

		const rect = canvas.getBoundingClientRect();
		return { width: rect.width, height: rect.height };
	}

	/**
	 * Get current manipulation state
	 */
	getState(): ManipulationState {
		return { ...this.state };
	}

	/**
	 * Update configuration
	 */
	updateConfig(config: Partial<GestureManipulationConfig>): void {
		this.config = { ...this.config, ...config };
	}

	/**
	 * Reset manipulation state
	 */
	reset(): void {
		this.state.selectedRegions = [];
		this.state.highlightedRegions = [];
		this.state.dissectedRegions = [];
		this.state.visibleLayers = ["surface"];
		this.state.transparency = {};
		this.state.dissection = {
			active: false,
			progress: 0,
			animationSpeed: 1,
		};

		this.clearHighlights();
		this.updateRegionVisuals();
		this.updateLayerVisibility();
	}

	/**
	 * Dispose of resources
	 */
	dispose(): void {
		// Clear all timeouts
		for (const timeout of this.hoverTimeouts.values()) {
			clearTimeout(timeout);
		}
		this.hoverTimeouts.clear();

		// Remove all labels
		for (const label of this.labelElements.values()) {
			label.remove();
		}
		this.labelElements.clear();

		// Clear dissection animations
		this.dissectionAnimations.clear();
	}
}
