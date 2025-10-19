import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useRef,
	useEffect,
} from "react";
import { useTheme } from "./theme-system";

// Panel types and interfaces
export interface DashboardPanel {
	id: string;
	title: string;
	type:
		| "brain-3d"
		| "supplement-list"
		| "stack-builder"
		| "search"
		| "analysis"
		| "settings"
		| "tutorial";
	position: { x: number; y: number };
	size: { width: number; height: number };
	minSize: { width: number; height: number };
	isResizable: boolean;
	isCollapsible: boolean;
	isCollapsed: boolean;
	zIndex: number;
}

export interface DashboardLayout {
	id: string;
	name: string;
	panels: DashboardPanel[];
	gridSize: number;
	snapToGrid: boolean;
}

// Dashboard context
interface DashboardContextType {
	currentLayout: DashboardLayout;
	setLayout: (layout: DashboardLayout) => void;
	addPanel: (panel: Omit<DashboardPanel, "id">) => void;
	removePanel: (panelId: string) => void;
	updatePanel: (panelId: string, updates: Partial<DashboardPanel>) => void;
	availableLayouts: DashboardLayout[];
	saveLayout: (name: string) => void;
	loadLayout: (layoutId: string) => void;
	resetLayout: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
	undefined,
);

// Default layouts
const defaultLayout: DashboardLayout = {
	id: "default",
	name: "Domyślny",
	gridSize: 20,
	snapToGrid: true,
	panels: [
		{
			id: "brain-3d",
			title: "Wizualizacja 3D Mózgu",
			type: "brain-3d",
			position: { x: 0, y: 0 },
			size: { width: 800, height: 600 },
			minSize: { width: 400, height: 300 },
			isResizable: true,
			isCollapsible: true,
			isCollapsed: false,
			zIndex: 1,
		},
		{
			id: "supplement-list",
			title: "Lista Suplementów",
			type: "supplement-list",
			position: { x: 820, y: 0 },
			size: { width: 400, height: 400 },
			minSize: { width: 300, height: 200 },
			isResizable: true,
			isCollapsible: true,
			isCollapsed: false,
			zIndex: 2,
		},
		{
			id: "stack-builder",
			title: "Kreator Stosów",
			type: "stack-builder",
			position: { x: 820, y: 420 },
			size: { width: 400, height: 280 },
			minSize: { width: 300, height: 200 },
			isResizable: true,
			isCollapsible: true,
			isCollapsed: false,
			zIndex: 3,
		},
	],
};

// Dashboard provider component
export function DashboardProvider({ children }: { children: React.ReactNode }) {
	const [currentLayout, setCurrentLayout] =
		useState<DashboardLayout>(defaultLayout);
	const [availableLayouts, setAvailableLayouts] = useState<DashboardLayout[]>([
		defaultLayout,
	]);
	const [draggedPanel, setDraggedPanel] = useState<string | null>(null);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

	// Load saved layouts from localStorage
	useEffect(() => {
		const saved = localStorage.getItem("suplementor-dashboard-layouts");
		if (saved) {
			try {
				const layouts = JSON.parse(saved) as DashboardLayout[];
				setAvailableLayouts(layouts);
			} catch (error) {
				console.error("Failed to load dashboard layouts:", error);
			}
		}
	}, []);

	// Save layouts to localStorage
	const saveLayouts = useCallback((layouts: DashboardLayout[]) => {
		localStorage.setItem(
			"suplementor-dashboard-layouts",
			JSON.stringify(layouts),
		);
		setAvailableLayouts(layouts);
	}, []);

	const setLayout = useCallback((layout: DashboardLayout) => {
		setCurrentLayout(layout);
	}, []);

	const addPanel = useCallback((panelData: Omit<DashboardPanel, "id">) => {
		const newPanel: DashboardPanel = {
			...panelData,
			id: `panel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		};

		setCurrentLayout((prev) => ({
			...prev,
			panels: [...prev.panels, newPanel],
		}));
	}, []);

	const removePanel = useCallback((panelId: string) => {
		setCurrentLayout((prev) => ({
			...prev,
			panels: prev.panels.filter((panel) => panel.id !== panelId),
		}));
	}, []);

	const updatePanel = useCallback(
		(panelId: string, updates: Partial<DashboardPanel>) => {
			setCurrentLayout((prev) => ({
				...prev,
				panels: prev.panels.map((panel) =>
					panel.id === panelId ? { ...panel, ...updates } : panel,
				),
			}));
		},
		[],
	);

	const saveLayout = useCallback(
		(name: string) => {
			const newLayout: DashboardLayout = {
				...currentLayout,
				id: `layout-${Date.now()}`,
				name,
			};

			const updatedLayouts = [...availableLayouts, newLayout];
			saveLayouts(updatedLayouts);
			setCurrentLayout(newLayout);
		},
		[currentLayout, availableLayouts, saveLayouts],
	);

	const loadLayout = useCallback(
		(layoutId: string) => {
			const layout = availableLayouts.find((l) => l.id === layoutId);
			if (layout) {
				setCurrentLayout(layout);
			}
		},
		[availableLayouts],
	);

	const resetLayout = useCallback(() => {
		setCurrentLayout(defaultLayout);
	}, []);

	return (
		<DashboardContext.Provider
			value={{
				currentLayout,
				setLayout,
				addPanel,
				removePanel,
				updatePanel,
				availableLayouts,
				saveLayout,
				loadLayout,
				resetLayout,
			}}
		>
			{children}
		</DashboardContext.Provider>
	);
}

// Hook for using dashboard
export function useDashboard() {
	const context = useContext(DashboardContext);
	if (context === undefined) {
		throw new Error("useDashboard must be used within a DashboardProvider");
	}
	return context;
}

// Panel component
interface PanelProps {
	panel: DashboardPanel;
	children: React.ReactNode;
	onMouseDown?: (e: React.MouseEvent) => void;
	style?: React.CSSProperties;
}

export function Panel({ panel, children, onMouseDown, style }: PanelProps) {
	const { updatePanel } = useDashboard();
	const { currentTheme } = useTheme();

	const handleToggleCollapse = () => {
		updatePanel(panel.id, { isCollapsed: !panel.isCollapsed });
	};

	return (
		<div
			className="panel"
			style={{
				position: "absolute",
				left: panel.position.x,
				top: panel.position.y,
				width: panel.isCollapsed ? "auto" : panel.size.width,
				height: panel.isCollapsed ? "auto" : panel.size.height,
				minWidth: panel.minSize.width,
				minHeight: panel.minSize.height,
				backgroundColor: currentTheme.colors.surface,
				border: `1px solid ${currentTheme.colors.border}`,
				borderRadius: currentTheme.borderRadius.lg,
				boxShadow: currentTheme.shadows.lg,
				zIndex: panel.zIndex,
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
				...style,
			}}
			onMouseDown={onMouseDown}
		>
			{/* Panel Header */}
			<div
				className="panel-header"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: `${currentTheme.spacing.sm} ${currentTheme.spacing.md}`,
					backgroundColor: currentTheme.colors.surfaceVariant,
					borderBottom: `1px solid ${currentTheme.colors.border}`,
					cursor: "move",
					userSelect: "none",
				}}
			>
				<h3
					style={{
						margin: 0,
						fontSize: currentTheme.typography.fontSize.sm,
						fontWeight: currentTheme.typography.fontWeight.medium,
						color: currentTheme.colors.onSurfaceVariant,
					}}
				>
					{panel.title}
				</h3>
				{panel.isCollapsible && (
					<button
						onClick={handleToggleCollapse}
						style={{
							background: "none",
							border: "none",
							color: currentTheme.colors.onSurfaceVariant,
							cursor: "pointer",
							padding: currentTheme.spacing.xs,
							borderRadius: currentTheme.borderRadius.sm,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
						aria-label={panel.isCollapsed ? "Rozwiń panel" : "Zwiń panel"}
					>
						{panel.isCollapsed ? "▶" : "▼"}
					</button>
				)}
			</div>

			{/* Panel Content */}
			{!panel.isCollapsed && (
				<div
					className="panel-content"
					style={{
						flex: 1,
						overflow: "hidden",
						position: "relative",
					}}
				>
					{children}
				</div>
			)}
		</div>
	);
}

// Resizer component for panel resizing
interface ResizerProps {
	direction: "horizontal" | "vertical";
	onResize: (delta: number) => void;
}

export function Resizer({ direction, onResize }: ResizerProps) {
	const { currentTheme } = useTheme();
	const [isResizing, setIsResizing] = useState(false);
	const startPos = useRef(0);

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsResizing(true);
		startPos.current = direction === "horizontal" ? e.clientX : e.clientY;
		e.preventDefault();
	};

	useEffect(() => {
		if (!isResizing) return;

		const handleMouseMove = (e: MouseEvent) => {
			const currentPos = direction === "horizontal" ? e.clientX : e.clientY;
			const delta = currentPos - startPos.current;
			onResize(delta);
			startPos.current = currentPos;
		};

		const handleMouseUp = () => {
			setIsResizing(false);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isResizing, direction, onResize]);

	return (
		<div
			className={`resizer resizer-${direction}`}
			style={{
				position: "absolute",
				backgroundColor: isResizing
					? currentTheme.colors.primary
					: "transparent",
				opacity: isResizing ? 1 : 0,
				transition: "opacity 0.2s ease",
				...(direction === "horizontal"
					? {
							right: -2,
							top: 0,
							bottom: 0,
							width: 4,
							cursor: "col-resize",
						}
					: {
							bottom: -2,
							left: 0,
							right: 0,
							height: 4,
							cursor: "row-resize",
						}),
			}}
			onMouseDown={handleMouseDown}
		/>
	);
}

// Main dashboard component
export function Dashboard({ children }: { children: React.ReactNode }) {
	const { currentLayout, updatePanel } = useDashboard();
	const { currentTheme } = useTheme();
	const dashboardRef = useRef<HTMLDivElement>(null);

	const handlePanelMouseDown = (panelId: string) => (e: React.MouseEvent) => {
		// Bring panel to front
		updatePanel(panelId, {
			zIndex: Math.max(...currentLayout.panels.map((p) => p.zIndex)) + 1,
		});

		// Set up dragging
		const panel = currentLayout.panels.find((p) => p.id === panelId);
		if (panel) {
			const rect = (e.target as HTMLElement).getBoundingClientRect();
			setDragOffset({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
		}
	};

	return (
		<div
			ref={dashboardRef}
			className="dashboard"
			style={{
				position: "relative",
				width: "100%",
				height: "100vh",
				backgroundColor: currentTheme.colors.background,
				overflow: "hidden",
			}}
		>
			{currentLayout.panels.map((panel) => (
				<Panel
					key={panel.id}
					panel={panel}
					onMouseDown={handlePanelMouseDown(panel.id)}
				>
					{children}
				</Panel>
			))}

			{/* Render resizers for each panel */}
			{currentLayout.panels.map((panel) => (
				<React.Fragment key={`resizers-${panel.id}`}>
					{panel.isResizable && (
						<>
							<Resizer
								direction="horizontal"
								onResize={(delta) => {
									updatePanel(panel.id, {
										size: {
											...panel.size,
											width: Math.max(
												panel.size.width + delta,
												panel.minSize.width,
											),
										},
									});
								}}
							/>
							<Resizer
								direction="vertical"
								onResize={(delta) => {
									updatePanel(panel.id, {
										size: {
											...panel.size,
											height: Math.max(
												panel.size.height + delta,
												panel.minSize.height,
											),
										},
									});
								}}
							/>
						</>
					)}
				</React.Fragment>
			))}
		</div>
	);
}
