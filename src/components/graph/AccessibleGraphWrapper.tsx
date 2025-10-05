"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Accessibility,
	Contrast,
	Eye,
	EyeOff,
	HelpCircle,
	Keyboard,
	Navigation,
	RotateCcw,
	Settings,
	Volume2,
	VolumeX,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
	FocusManager,
	HighContrastManager,
	ScreenReaderUtils,
	highContrastManager,
	keyboardNavigation,
	matchesKeyboardShortcut,
	polishAriaLabels,
	polishLiveRegionMessages,
	screenReader,
} from "@/lib/utils/accessibility";

import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";

interface AccessibleGraphWrapperProps {
	children: React.ReactNode;
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	selectedNodeIds?: string[];
	onNodeSelect?: (nodeId: string) => void;
	onKeyboardNavigation?: (action: string, data?: any) => void;
	className?: string;
}

const AccessibleGraphWrapper: React.FC<AccessibleGraphWrapperProps> = ({
	children,
	nodes,
	relationships,
	selectedNodeIds = [],
	onNodeSelect,
	onKeyboardNavigation,
	className = "",
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const focusManagerRef = useRef<FocusManager | null>(null);
	const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
	const [isScreenReaderMode, setIsScreenReaderMode] = useState(false);
	const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
	const [announcements, setAnnouncements] = useState(true);
	const [highContrast, setHighContrast] = useState(false);

	// Initialize accessibility managers
	useEffect(() => {
		if (containerRef.current) {
			focusManagerRef.current = new FocusManager(containerRef.current);
		}

		// Announce graph load
		if (nodes.length > 0) {
			screenReader.announceGraphLoad(nodes.length, relationships.length);
		}

		return () => {
			// Cleanup is handled by the singleton instances
		};
	}, [nodes.length, relationships.length]);

	// Update focus manager when nodes change
	useEffect(() => {
		focusManagerRef.current?.updateFocusableElements();
	}, [nodes]);

	// Keyboard navigation handler
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			// Prevent default for handled shortcuts
			let handled = false;

			// Graph navigation shortcuts
			if (matchesKeyboardShortcut(event, keyboardNavigation.ZOOM_IN)) {
				onKeyboardNavigation?.("zoom", { direction: "in" });
				handled = true;
			} else if (matchesKeyboardShortcut(event, keyboardNavigation.ZOOM_OUT)) {
				onKeyboardNavigation?.("zoom", { direction: "out" });
				handled = true;
			} else if (
				matchesKeyboardShortcut(event, keyboardNavigation.RESET_VIEW)
			) {
				onKeyboardNavigation?.("reset");
				if (announcements) {
					screenReader.announce("Widok grafu został zresetowany", "polite");
				}
				handled = true;
			} else if (
				matchesKeyboardShortcut(event, keyboardNavigation.CENTER_GRAPH)
			) {
				onKeyboardNavigation?.("center");
				if (announcements) {
					screenReader.announce("Graf został wyśrodkowany", "polite");
				}
				handled = true;
			}

			// Node selection shortcuts
			else if (matchesKeyboardShortcut(event, keyboardNavigation.SELECT_NEXT)) {
				navigateToNextNode();
				handled = true;
			} else if (
				matchesKeyboardShortcut(event, keyboardNavigation.SELECT_PREVIOUS)
			) {
				navigateToPreviousNode();
				handled = true;
			} else if (
				matchesKeyboardShortcut(event, keyboardNavigation.ACTIVATE_NODE)
			) {
				activateCurrentNode();
				handled = true;
			} else if (
				matchesKeyboardShortcut(event, keyboardNavigation.DESELECT_ALL)
			) {
				onKeyboardNavigation?.("deselectAll");
				if (announcements) {
					screenReader.announce("Wszystkie węzły zostały odznaczone", "polite");
				}
				handled = true;
			}

			// Help and accessibility shortcuts
			else if (matchesKeyboardShortcut(event, keyboardNavigation.SHOW_HELP)) {
				setShowKeyboardHelp(!showKeyboardHelp);
				handled = true;
			}

			if (handled) {
				event.preventDefault();
				event.stopPropagation();
			}
		},
		[
			currentNodeIndex,
			nodes,
			onKeyboardNavigation,
			announcements,
			showKeyboardHelp,
		],
	);

	// Attach keyboard event listeners
	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	// Node navigation functions
	const navigateToNextNode = useCallback(() => {
		if (nodes.length === 0) return;

		const nextIndex = (currentNodeIndex + 1) % nodes.length;
		setCurrentNodeIndex(nextIndex);

		const nextNode = nodes[nextIndex];
		if (announcements && nextNode) {
			screenReader.announceNodeSelection(
				nextNode?.polishName || nextNode?.name || "",
				nextNode?.type,
			);
		}

		if (nextNode) {
			onKeyboardNavigation?.("selectNode", {
				nodeId: nextNode.id,
				index: nextIndex,
			});
		}
	}, [currentNodeIndex, nodes, announcements, onKeyboardNavigation]);

	const navigateToPreviousNode = useCallback(() => {
		if (nodes.length === 0) return;

		const prevIndex =
			currentNodeIndex === 0 ? nodes.length - 1 : currentNodeIndex - 1;
		setCurrentNodeIndex(prevIndex);

		const prevNode = nodes[prevIndex];
		if (announcements && prevNode) {
			screenReader.announceNodeSelection(
				prevNode?.polishName || prevNode?.name || "",
				prevNode?.type,
			);
		}

		if (prevNode) {
			onKeyboardNavigation?.("selectNode", {
				nodeId: prevNode.id,
				index: prevIndex,
			});
		}
	}, [currentNodeIndex, nodes, announcements, onKeyboardNavigation]);

	const activateCurrentNode = useCallback(() => {
		if (nodes.length === 0 || currentNodeIndex >= nodes.length) return;

		const currentNode = nodes[currentNodeIndex];
		if (!currentNode) return;

		onNodeSelect?.(currentNode.id);

		if (announcements) {
			const isSelected = selectedNodeIds.includes(currentNode.id);
			const message = isSelected
				? polishLiveRegionMessages.nodeDeselected(
						currentNode?.polishName || currentNode?.name || "",
					)
				: polishLiveRegionMessages.nodeSelected(
						currentNode?.polishName || currentNode?.name || "",
					);
			screenReader.announce(message, "assertive");
		}
	}, [currentNodeIndex, nodes, onNodeSelect, selectedNodeIds, announcements]);

	// Toggle high contrast mode
	const toggleHighContrast = useCallback(() => {
		const newHighContrast = !highContrast;
		setHighContrast(newHighContrast);
		highContrastManager.toggleHighContrast();

		if (announcements) {
			screenReader.announce(
				newHighContrast
					? "Tryb wysokiego kontrastu włączony"
					: "Tryb wysokiego kontrastu wyłączony",
				"polite",
			);
		}
	}, [highContrast, announcements]);

	// Toggle screen reader mode
	const toggleScreenReaderMode = useCallback(() => {
		setIsScreenReaderMode(!isScreenReaderMode);
		if (announcements) {
			screenReader.announce(
				isScreenReaderMode
					? "Tryb czytnika ekranu wyłączony"
					: "Tryb czytnika ekranu włączony",
				"polite",
			);
		}
	}, [isScreenReaderMode, announcements]);

	// Get current node info for screen readers
	const getCurrentNodeInfo = useCallback(() => {
		if (nodes.length === 0 || currentNodeIndex >= nodes.length) return null;

		const node = nodes[currentNodeIndex];
		if (!node) return null;

		return {
			name: node?.polishName || node?.name || "",
			type: node?.type,
			description: node?.polishDescription || node?.description,
			importance: node?.importance,
			connections: relationships.filter(
				(r) => r.sourceId === node.id || r.targetId === node.id,
			).length,
		};
	}, [currentNodeIndex, nodes, relationships]);

	const currentNodeInfo = getCurrentNodeInfo();

	return (
		<div
			ref={containerRef}
			className={`relative ${className}`}
			role="application"
			aria-label={polishAriaLabels.graphCanvas}
			aria-describedby="graph-description"
		>
			{/* Hidden description for screen readers */}
			<div id="graph-description" className="sr-only">
				Graf wiedzy o suplementach zawierający {nodes.length} węzłów i{" "}
				{relationships.length} połączeń. Użyj klawiszy strzałek do nawigacji,
				Enter do wyboru węzła, H dla pomocy.
			</div>

			{/* Accessibility toolbar */}
			<div className="absolute top-2 right-2 z-50 flex gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={toggleHighContrast}
					aria-label="Przełącz tryb wysokiego kontrastu"
					aria-pressed={highContrast}
				>
					<Contrast className="h-4 w-4" />
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={toggleScreenReaderMode}
					aria-label="Przełącz tryb czytnika ekranu"
					aria-pressed={isScreenReaderMode}
				>
					{isScreenReaderMode ? (
						<Volume2 className="h-4 w-4" />
					) : (
						<VolumeX className="h-4 w-4" />
					)}
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={() => setAnnouncements(!announcements)}
					aria-label="Przełącz ogłoszenia"
					aria-pressed={announcements}
				>
					{announcements ? (
						<Eye className="h-4 w-4" />
					) : (
						<EyeOff className="h-4 w-4" />
					)}
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
					aria-label="Pokaż pomoc klawiatury"
					aria-expanded={showKeyboardHelp}
				>
					<HelpCircle className="h-4 w-4" />
				</Button>
			</div>

			{/* Current node info for screen readers */}
			{isScreenReaderMode && currentNodeInfo && (
				<Card className="absolute top-16 right-2 z-40 w-80">
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-sm">
							<Navigation className="h-4 w-4" />
							Aktualny węzeł ({currentNodeIndex + 1} z {nodes.length})
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div>
							<strong>{currentNodeInfo.name}</strong>
							<Badge variant="outline" className="ml-2 text-xs">
								{currentNodeInfo.type}
							</Badge>
						</div>
						{currentNodeInfo.description && (
							<p className="text-gray-600 text-sm">
								{currentNodeInfo.description}
							</p>
						)}
						<div className="text-gray-500 text-xs">
							Połączenia: {currentNodeInfo.connections} | Ważność:{" "}
							{Math.round((currentNodeInfo.importance || 0) * 100)}%
						</div>
					</CardContent>
				</Card>
			)}

			{/* Keyboard help modal */}
			{showKeyboardHelp && (
				<Card className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-50 max-h-96 w-96 transform overflow-y-auto">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Keyboard className="h-5 w-5" />
							Skróty klawiszowe
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div>
							<h4 className="mb-2 font-medium">Nawigacja grafu</h4>
							<ul className="space-y-1 text-sm">
								<li>
									<kbd>+</kbd> / <kbd>=</kbd> - Powiększ
								</li>
								<li>
									<kbd>-</kbd> - Pomniejsz
								</li>
								<li>
									<kbd>R</kbd> / <kbd>Home</kbd> - Resetuj widok
								</li>
								<li>
									<kbd>C</kbd> - Wyśrodkuj graf
								</li>
							</ul>
						</div>

						<div>
							<h4 className="mb-2 font-medium">Wybór węzłów</h4>
							<ul className="space-y-1 text-sm">
								<li>
									<kbd>→</kbd> / <kbd>Tab</kbd> - Następny węzeł
								</li>
								<li>
									<kbd>←</kbd> / <kbd>Shift+Tab</kbd> - Poprzedni węzeł
								</li>
								<li>
									<kbd>Enter</kbd> / <kbd>Space</kbd> - Aktywuj węzeł
								</li>
								<li>
									<kbd>Esc</kbd> - Odznacz wszystkie
								</li>
							</ul>
						</div>

						<div>
							<h4 className="mb-2 font-medium">Dostępność</h4>
							<ul className="space-y-1 text-sm">
								<li>
									<kbd>H</kbd> / <kbd>F1</kbd> - Ta pomoc
								</li>
								<li>
									<kbd>Ctrl+E</kbd> - Eksport
								</li>
								<li>
									<kbd>Ctrl+I</kbd> - Import
								</li>
							</ul>
						</div>

						<Button
							onClick={() => setShowKeyboardHelp(false)}
							className="mt-4 w-full"
						>
							Zamknij
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Main graph content */}
			<div
				className="relative"
				role="img"
				aria-label={`Graf z ${nodes.length} węzłami i ${relationships.length} połączeniami`}
			>
				{children}
			</div>

			{/* Status bar for screen readers */}
			<div className="sr-only" aria-live="polite" aria-atomic="true">
				{selectedNodeIds.length > 0 && (
					<span>Wybrano {selectedNodeIds.length} węzłów</span>
				)}
			</div>

			{/* Accessibility status */}
			{(highContrast || isScreenReaderMode || !announcements) && (
				<Alert className="absolute bottom-2 left-2 w-auto">
					<Accessibility className="h-4 w-4" />
					<AlertDescription className="flex items-center gap-2">
						Tryby dostępności:
						{highContrast && <Badge variant="secondary">Wysoki kontrast</Badge>}
						{isScreenReaderMode && (
							<Badge variant="secondary">Czytnik ekranu</Badge>
						)}
						{!announcements && <Badge variant="outline">Bez ogłoszeń</Badge>}
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
};

export default AccessibleGraphWrapper;
