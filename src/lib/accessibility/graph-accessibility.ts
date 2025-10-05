/**
 * Graph Accessibility Utilities
 * Provides accessibility utilities for WCAG compliance with proper ARIA labels,
 * keyboard navigation, and screen reader support for Polish users
 */

import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { RefObject } from "react";

/**
 * Focus management utilities for graph components
 */
export class GraphFocusManager {
	private static instance: GraphFocusManager;
	private focusedElementId: string | null = null;
	private keyboardNavigationEnabled = true;

	public static getInstance(): GraphFocusManager {
		if (!GraphFocusManager.instance) {
			GraphFocusManager.instance = new GraphFocusManager();
		}
		return GraphFocusManager.instance;
	}

	/**
	 * Sets the currently focused element in the graph
	 */
	setFocusedElement(id: string): void {
		this.focusedElementId = id;
		this.announceToScreenReader(`Węzeł ${id} jest teraz aktywny`);
	}

	/**
	 * Gets the currently focused element ID
	 */
	getFocusedElementId(): string | null {
		return this.focusedElementId;
	}

	/**
	 * Enables or disables keyboard navigation
	 */
	setKeyboardNavigation(enabled: boolean): void {
		this.keyboardNavigationEnabled = enabled;
	}

	/**
	 * Checks if keyboard navigation is enabled
	 */
	isKeyboardNavigationEnabled(): boolean {
		return this.keyboardNavigationEnabled;
	}

	/**
	 * Announces a message to screen readers
	 */
	announceToScreenReader(message: string): void {
		const announcement = document.createElement("div");
		announcement.setAttribute("aria-live", "polite");
		announcement.setAttribute("aria-atomic", "true");
		announcement.className = "sr-only";
		announcement.textContent = message;

		document.body.appendChild(announcement);

		setTimeout(() => {
			document.body.removeChild(announcement);
		}, 1000);
	}

	/**
	 * Handles keyboard navigation for graph elements
	 */
	handleKeyboardNavigation(
		event: KeyboardEvent,
		nodes: KnowledgeNode[],
		relationships: KnowledgeRelationship[],
		onNodeFocus: (node: KnowledgeNode) => void,
		onRelationshipFocus: (relationship: KnowledgeRelationship) => void,
	): void {
		if (!this.keyboardNavigationEnabled) return;

		const focusedIndex = this.getFocusedIndex(nodes, relationships);

		switch (event.key) {
			case "ArrowRight":
			case "ArrowDown":
				event.preventDefault();
				this.focusNextElement(
					focusedIndex,
					nodes,
					relationships,
					onNodeFocus,
					onRelationshipFocus,
				);
				break;

			case "ArrowLeft":
			case "ArrowUp":
				event.preventDefault();
				this.focusPreviousElement(
					focusedIndex,
					nodes,
					relationships,
					onNodeFocus,
					onRelationshipFocus,
				);
				break;

			case "Enter":
			case " ":
				event.preventDefault();
				this.activateFocusedElement(
					focusedIndex,
					nodes,
					relationships,
					onNodeFocus,
					onRelationshipFocus,
				);
				break;

			case "Escape":
				this.clearFocus();
				break;
		}
	}

	private getFocusedIndex(
		nodes: KnowledgeNode[],
		relationships: KnowledgeRelationship[],
	): number {
		if (!this.focusedElementId) return -1;

		const nodeIndex = nodes.findIndex(
			(node) => node.id === this.focusedElementId,
		);
		if (nodeIndex !== -1) return nodeIndex;

		const relationshipIndex = relationships.findIndex(
			(rel) => rel.id === this.focusedElementId,
		);
		if (relationshipIndex !== -1) return -(relationshipIndex + 1); // Negative indicates relationship

		return -1;
	}

	private focusNextElement(
		currentIndex: number,
		nodes: KnowledgeNode[],
		relationships: KnowledgeRelationship[],
		onNodeFocus: (node: KnowledgeNode) => void,
		onRelationshipFocus: (relationship: KnowledgeRelationship) => void,
	): void {
		if (currentIndex < nodes.length - 1) {
			const nextNode = nodes[currentIndex + 1]!;
			this.setFocusedElement(nextNode.id);
			onNodeFocus(nextNode);
		} else if (-currentIndex - 1 < relationships.length - 1) {
			const relIndex = -currentIndex - 1;
			const nextRelationship = relationships[relIndex + 1]!;
			this.setFocusedElement(nextRelationship.id);
			onRelationshipFocus(nextRelationship);
		} else {
			// Wrap around to first element
			if (nodes.length > 0) {
				const firstNode = nodes[0]!;
				this.setFocusedElement(firstNode.id);
				onNodeFocus(firstNode);
			} else if (relationships.length > 0) {
				const firstRel = relationships[0]!;
				this.setFocusedElement(firstRel.id);
				onRelationshipFocus(firstRel);
			}
		}
	}

	private focusPreviousElement(
		currentIndex: number,
		nodes: KnowledgeNode[],
		relationships: KnowledgeRelationship[],
		onNodeFocus: (node: KnowledgeNode) => void,
		onRelationshipFocus: (relationship: KnowledgeRelationship) => void,
	): void {
		if (currentIndex > 0) {
			const prevNode = nodes[currentIndex - 1]!;
			this.setFocusedElement(prevNode.id);
			onNodeFocus(prevNode);
		} else if (currentIndex < 0) {
			const relIndex = -currentIndex - 1;
			if (relIndex > 0) {
				const prevRelationship = relationships[relIndex - 1]!;
				this.setFocusedElement(prevRelationship.id);
				onRelationshipFocus(prevRelationship);
			} else {
				// Wrap to last node
				if (nodes.length > 0) {
					const lastNode = nodes[nodes.length - 1]!;
					this.setFocusedElement(lastNode.id);
					onNodeFocus(lastNode);
				}
			}
		} else {
			// Wrap around to last element
			if (relationships.length > 0) {
				const lastRelationship = relationships[relationships.length - 1]!;
				this.setFocusedElement(lastRelationship.id);
				onRelationshipFocus(lastRelationship);
			} else if (nodes.length > 0) {
				const lastNode = nodes[nodes.length - 1]!;
				this.setFocusedElement(lastNode.id);
				onNodeFocus(lastNode);
			}
		}
	}

	private activateFocusedElement(
		currentIndex: number,
		nodes: KnowledgeNode[],
		relationships: KnowledgeRelationship[],
		onNodeFocus: (node: KnowledgeNode) => void,
		onRelationshipFocus: (relationship: KnowledgeRelationship) => void,
	): void {
		if (currentIndex >= 0 && currentIndex < nodes.length) {
			onNodeFocus(nodes[currentIndex]!);
		} else if (currentIndex < 0) {
			const relIndex = -currentIndex - 1;
			if (relIndex < relationships.length) {
				onRelationshipFocus(relationships[relIndex]!);
			}
		}
	}

	private clearFocus(): void {
		this.focusedElementId = null;
		this.announceToScreenReader("Focus został usunięty");
	}
}

/**
 * Accessibility utilities for canvas-based graph visualization
 */
export class CanvasAccessibilityManager {
	static addKeyboardNavigation(
		canvasRef: RefObject<HTMLCanvasElement>,
		nodes: KnowledgeNode[],
		onNodeFocus: (node: KnowledgeNode) => void,
	): void {
		if (!canvasRef.current) return;

		canvasRef.current.addEventListener("keydown", (event) => {
			const focusManager = GraphFocusManager.getInstance();
			focusManager.handleKeyboardNavigation(
				event as unknown as KeyboardEvent,
				nodes,
				[],
				onNodeFocus,
				() => {}, // Relationships not applicable for canvas
			);
		});

		// Make canvas focusable
		canvasRef.current.setAttribute("tabindex", "0");
		canvasRef.current.setAttribute("role", "img");
		canvasRef.current.setAttribute(
			"aria-label",
			"Graf wizualizacyjny wiedzy o suplementach",
		);
	}

	static updateCanvasAriaAttributes(
		canvasRef: RefObject<HTMLCanvasElement>,
		nodeCount: number,
		relationshipCount: number,
	): void {
		if (!canvasRef.current) return;

		canvasRef.current.setAttribute(
			"aria-description",
			`Wizualizacja grafu zawierająca ${nodeCount} węzłów i ${relationshipCount} relacji`,
		);
	}
}

/**
 * Utility functions for ARIA labels and descriptions
 */
export class AriaLabelUtils {
	static getNodeAriaLabel(node: KnowledgeNode): string {
		return `${node.polishName || node.name} - typ: ${node.type}, poziom dowodów: ${node.evidenceLevel}`;
	}

	static getRelationshipAriaLabel(
		relationship: KnowledgeRelationship,
		allNodes: KnowledgeNode[],
	): string {
		const sourceNode = allNodes.find((n) => n.id === relationship.sourceId);
		const targetNode = allNodes.find((n) => n.id === relationship.targetId);

		return `${relationship.polishMechanism || relationship.mechanism} - ${sourceNode?.polishName || sourceNode?.name} do ${targetNode?.polishName || targetNode?.name}, siła: ${relationship.strength}`;
	}

	static getGraphContainerAriaLabel(
		nodeCount: number,
		relationshipCount: number,
	): string {
		return `Graf wiedzy o suplementach zawierający ${nodeCount} węzłów i ${relationshipCount} relacji. Użyj klawiatury do nawigacji.`;
	}
}

// Singleton instance for global use
export const graphFocusManager = GraphFocusManager.getInstance();
