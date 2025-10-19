"use client";

import type { BodySystem } from "@/data/body-systems";
import type { Vector3D, WebGLContext } from "@/lib/types/transitions";
import { useCallback, useEffect, useRef, useState } from "react";

interface ConnectionVisualizerProps {
	sourceSystem: BodySystem;
	targetSystem: BodySystem;
	connections: SystemConnection[];
	onConnection?: (connection: SystemConnection) => void;
	autoStart?: boolean;
	animationDuration?: number;
	showLabels?: boolean;
	showParticles?: boolean;
	webglContext?: WebGLContext | null;
}

interface SystemConnection {
	id: string;
	sourceOrganId: string;
	targetOrganId: string;
	strength: number; // 0.0 to 1.0
	type: "neural" | "vascular" | "hormonal" | "functional" | "structural";
	description: string;
	polishDescription: string;
	path: ConnectionPath;
}

interface ConnectionPath {
	points: Vector3D[];
	controlPoints?: Vector3D[];
	curvature: number;
	animation: "flow" | "pulse" | "wave" | "static";
	speed: number;
}

interface ConnectionState {
	activeConnections: string[];
	animationProgress: number;
	particlePositions: Map<string, Vector3D[]>;
}

export class ConnectionVisualizer {
	private animationId: number | null = null;
	private startTime = 0;
	private isAnimating = false;
	private webglContext: WebGLContext | null;
	private particleSystems = new Map<string, ParticleSystem>();

	constructor(
		private connections: SystemConnection[],
		webglContext?: WebGLContext | null,
	) {
		this.webglContext = webglContext || null;
		this.initializeParticleSystems();
	}

	private initializeParticleSystems(): void {
		this.connections.forEach((connection) => {
			const particleSystem = new ParticleSystem(connection);
			this.particleSystems.set(connection.id, particleSystem);
		});
	}

	async start(duration = 3000): Promise<void> {
		return new Promise((resolve) => {
			if (this.isAnimating) {
				resolve();
				return;
			}

			this.isAnimating = true;
			this.startTime = performance.now();

			const animate = (currentTime: number) => {
				const elapsed = currentTime - this.startTime;
				const progress = Math.min(elapsed / duration, 1);

				this.updateConnections(progress);

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

		// Stop all particle systems
		this.particleSystems.forEach((system) => system.stop());
	}

	getProgress(): number {
		if (!this.isAnimating) return 0;
		const elapsed = performance.now() - this.startTime;
		return Math.min(elapsed / 3000, 1);
	}

	private updateConnections(progress: number): void {
		this.connections.forEach((connection) => {
			const particleSystem = this.particleSystems.get(connection.id);
			if (particleSystem) {
				particleSystem.update(progress);
			}
		});
	}

	getActiveConnections(): string[] {
		return Array.from(this.particleSystems.keys());
	}

	getParticlePositions(): Map<string, Vector3D[]> {
		const positions = new Map<string, Vector3D[]>();
		this.particleSystems.forEach((system, id) => {
			positions.set(id, system.getParticlePositions());
		});
		return positions;
	}
}

// Particle System for connection visualization
class ParticleSystem {
	private particles: Particle[] = [];
	private animationProgress = 0;

	constructor(private connection: SystemConnection) {
		this.initializeParticles();
	}

	private initializeParticles(): void {
		const particleCount = Math.floor(this.connection.strength * 20) + 5; // 5-25 particles based on strength

		for (let i = 0; i < particleCount; i++) {
			this.particles.push({
				id: `${this.connection.id}-particle-${i}`,
				position: { ...this.connection.path.points[0] },
				velocity: { x: 0, y: 0, z: 0 },
				life: 1.0,
				maxLife: 1.0 + Math.random() * 2, // 1-3 seconds
				size: 0.02 + Math.random() * 0.03, // 0.02-0.05
				color: this.getConnectionColor(),
				trail: [],
			});
		}
	}

	update(progress: number): void {
		this.animationProgress = progress;

		this.particles.forEach((particle, index) => {
			this.updateParticle(particle, index);
		});

		// Remove dead particles
		this.particles = this.particles.filter((particle) => particle.life > 0);
	}

	private updateParticle(particle: Particle, index: number): void {
		// Calculate position along connection path
		const pathProgress = (this.animationProgress + index * 0.1) % 1;
		const pathPoint = this.getPointAlongPath(pathProgress);

		// Update particle position with smooth interpolation
		const lerpFactor = 0.1;
		particle.position.x += (pathPoint.x - particle.position.x) * lerpFactor;
		particle.position.y += (pathPoint.y - particle.position.y) * lerpFactor;
		particle.position.z += (pathPoint.z - particle.position.z) * lerpFactor;

		// Add some organic movement
		particle.position.x += Math.sin(this.animationProgress * 2 + index) * 0.01;
		particle.position.y +=
			Math.cos(this.animationProgress * 1.5 + index) * 0.01;

		// Update trail
		particle.trail.push({ ...particle.position });
		if (particle.trail.length > 10) {
			particle.trail.shift();
		}

		// Update life
		particle.life -= 0.016; // Decrease by ~1/60 per frame
	}

	private getPointAlongPath(progress: number): Vector3D {
		const points = this.connection.path.points;
		if (points.length === 0) return { x: 0, y: 0, z: 0 };

		if (points.length === 1) return points[0];

		// Linear interpolation between points
		const segmentCount = points.length - 1;
		const segmentIndex = Math.floor(progress * segmentCount);
		const segmentProgress = progress * segmentCount - segmentIndex;

		const startPoint = points[segmentIndex];
		const endPoint = points[segmentIndex + 1] || points[segmentIndex];

		return {
			x: startPoint.x + (endPoint.x - startPoint.x) * segmentProgress,
			y: startPoint.y + (endPoint.y - startPoint.y) * segmentProgress,
			z: startPoint.z + (endPoint.z - startPoint.z) * segmentProgress,
		};
	}

	private getConnectionColor(): string {
		switch (this.connection.type) {
			case "neural":
				return "#ffff00"; // Yellow for neural connections
			case "vascular":
				return "#ff0080"; // Pink for blood vessels
			case "hormonal":
				return "#00ffff"; // Cyan for hormonal signals
			case "functional":
				return "#ff8000"; // Orange for functional relationships
			case "structural":
				return "#ffffff"; // White for structural connections
			default:
				return "#00ff00"; // Green default
		}
	}

	getParticlePositions(): Vector3D[] {
		return this.particles.map((p) => p.position);
	}

	stop(): void {
		this.particles = [];
	}
}

interface Particle {
	id: string;
	position: Vector3D;
	velocity: Vector3D;
	life: number;
	maxLife: number;
	size: number;
	color: string;
	trail: Vector3D[];
}

// React Hook for using ConnectionVisualizer
export function useConnectionVisualizer(
	sourceSystem: BodySystem,
	targetSystem: BodySystem,
	connections: SystemConnection[],
	options: {
		autoStart?: boolean;
		animationDuration?: number;
		onConnection?: (connection: SystemConnection) => void;
	} = {},
) {
	const visualizerRef = useRef<ConnectionVisualizer | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [progress, setProgress] = useState(0);
	const [activeConnections, setActiveConnections] = useState<string[]>([]);
	const [particlePositions, setParticlePositions] = useState<
		Map<string, Vector3D[]>
	>(new Map());

	const { autoStart = false, animationDuration = 3000, onConnection } = options;

	useEffect(() => {
		visualizerRef.current = new ConnectionVisualizer(connections);

		if (autoStart) {
			startAnimation();
		}

		return () => {
			visualizerRef.current?.stop();
		};
	}, [connections]);

	const startAnimation = useCallback(async () => {
		if (!visualizerRef.current) return;

		setIsAnimating(true);
		setProgress(0);

		try {
			await visualizerRef.current.start(animationDuration);
			setIsAnimating(false);
			setProgress(1);
		} catch (error) {
			console.error("Connection visualization error:", error);
			setIsAnimating(false);
		}
	}, [animationDuration]);

	const stopAnimation = useCallback(() => {
		visualizerRef.current?.stop();
		setIsAnimating(false);
	}, []);

	// Update state periodically
	useEffect(() => {
		if (!isAnimating || !visualizerRef.current) return;

		const interval = setInterval(() => {
			const currentProgress = visualizerRef.current?.getProgress();
			const connections = visualizerRef.current?.getActiveConnections();
			const positions = visualizerRef.current?.getParticlePositions();

			setProgress(currentProgress);
			setActiveConnections(connections);
			setParticlePositions(positions);

			if (currentProgress >= 1) {
				clearInterval(interval);
			}
		}, 16); // ~60fps

		return () => clearInterval(interval);
	}, [isAnimating]);

	return {
		startAnimation,
		stopAnimation,
		isAnimating,
		progress,
		activeConnections,
		particlePositions,
	};
}

// React Component for ConnectionVisualizer
export function ConnectionVisualizerComponent({
	sourceSystem,
	targetSystem,
	connections,
	onConnection,
	autoStart = false,
	animationDuration = 3000,
	showLabels = true,
	showParticles = true,
	webglContext,
	children,
}: ConnectionVisualizerProps & { children?: React.ReactNode }) {
	const {
		startAnimation,
		stopAnimation,
		isAnimating,
		progress,
		activeConnections,
		particlePositions,
	} = useConnectionVisualizer(sourceSystem, targetSystem, connections, {
		autoStart,
		animationDuration,
		onConnection,
	});

	return (
		<div className="connection-visualizer">
			{/* SVG overlay for connection lines */}
			<svg
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					pointerEvents: "none",
					zIndex: 5,
				}}
			>
				{connections.map((connection) => (
					<ConnectionLine
						key={connection.id}
						connection={connection}
						isActive={activeConnections.includes(connection.id)}
						progress={progress}
						showLabels={showLabels}
					/>
				))}
			</svg>

			{/* Particle effects */}
			{showParticles && (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						pointerEvents: "none",
						zIndex: 6,
					}}
				>
					{Array.from(particlePositions.entries()).map(
						([connectionId, positions]) => (
							<ParticleEffects
								key={connectionId}
								positions={positions}
								connection={connections.find((c) => c.id === connectionId)!}
								progress={progress}
							/>
						),
					)}
				</div>
			)}

			{/* Children content */}
			<div style={{ position: "relative", zIndex: 1 }}>{children}</div>
		</div>
	);
}

// Connection Line Component
interface ConnectionLineProps {
	connection: SystemConnection;
	isActive: boolean;
	progress: number;
	showLabels: boolean;
}

function ConnectionLine({
	connection,
	isActive,
	progress,
	showLabels,
}: ConnectionLineProps) {
	const pathData = generatePathData(
		connection.path.points,
		connection.path.curvature,
	);

	return (
		<g>
			{/* Main connection path */}
			<path
				d={pathData}
				stroke={getConnectionColor(connection.type)}
				strokeWidth={isActive ? 3 : 1}
				fill="none"
				opacity={isActive ? 0.8 : 0.3}
				strokeDasharray={isActive ? "none" : "5,5"}
			>
				<animate
					attributeName="stroke-dashoffset"
					values="0;-20"
					dur="2s"
					repeatCount="indefinite"
					begin={isActive ? "0s" : "indefinite"}
				/>
			</path>

			{/* Animated flow effect */}
			{isActive && (
				<circle r="4" fill={getConnectionColor(connection.type)}>
					<animateMotion
						dur={`${2 / connection.path.speed}s`}
						repeatCount="indefinite"
						rotate="auto"
					>
						<mpath href={`#path-${connection.id}`} />
					</animateMotion>
				</circle>
			)}

			{/* Invisible path for animation */}
			<path
				id={`path-${connection.id}`}
				d={pathData}
				stroke="none"
				fill="none"
			/>

			{/* Connection labels */}
			{showLabels && isActive && (
				<text
					x="50%"
					y="50%"
					textAnchor="middle"
					dominantBaseline="middle"
					fill={getConnectionColor(connection.type)}
					fontSize="12"
					opacity={progress}
				>
					{connection.description}
				</text>
			)}
		</g>
	);
}

// Particle Effects Component
interface ParticleEffectsProps {
	positions: Vector3D[];
	connection: SystemConnection;
	progress: number;
}

function ParticleEffects({
	positions,
	connection,
	progress,
}: ParticleEffectsProps) {
	return (
		<>
			{positions.map((position, index) => (
				<div
					key={index}
					style={{
						position: "absolute",
						left: `${50 + position.x * 100}%`,
						top: `${50 + position.y * 100}%`,
						width: "4px",
						height: "4px",
						backgroundColor: getConnectionColor(connection.type),
						borderRadius: "50%",
						boxShadow: `0 0 10px ${getConnectionColor(connection.type)}`,
						opacity: progress * (1 - index / positions.length),
						transform: "translate(-50%, -50%)",
						zIndex: 10,
					}}
				/>
			))}
		</>
	);
}

// Utility functions
function generatePathData(points: Vector3D[], curvature = 0.5): string {
	if (points.length === 0) return "";
	if (points.length === 1) return `M ${points[0].x * 100} ${points[0].y * 100}`;

	let path = `M ${points[0].x * 100} ${points[0].y * 100}`;

	for (let i = 1; i < points.length; i++) {
		const prevPoint = points[i - 1];
		const currentPoint = points[i];

		if (i < points.length - 1 && curvature > 0) {
			// Create curved path using quadratic bezier
			const controlX = (prevPoint.x + currentPoint.x) / 2;
			const controlY = (prevPoint.y + currentPoint.y) / 2 - curvature;
			path += ` Q ${controlX * 100} ${controlY * 100} ${currentPoint.x * 100} ${currentPoint.y * 100}`;
		} else {
			path += ` L ${currentPoint.x * 100} ${currentPoint.y * 100}`;
		}
	}

	return path;
}

function getConnectionColor(type: SystemConnection["type"]): string {
	switch (type) {
		case "neural":
			return "#ffff00";
		case "vascular":
			return "#ff0080";
		case "hormonal":
			return "#00ffff";
		case "functional":
			return "#ff8000";
		case "structural":
			return "#ffffff";
		default:
			return "#00ff00";
	}
}

// Function to generate connections between body systems
export function generateSystemConnections(
	sourceSystem: BodySystem,
	targetSystem: BodySystem,
): SystemConnection[] {
	const connections: SystemConnection[] = [];

	// Generate connections based on anatomical relationships
	sourceSystem.anatomicalInfo.connections.forEach((connection, index) => {
		if (targetSystem.anatomicalInfo.connections.includes(connection)) {
			connections.push({
				id: `connection-${sourceSystem.id}-${targetSystem.id}-${index}`,
				sourceOrganId: sourceSystem.organs[0]?.id || "unknown",
				targetOrganId: targetSystem.organs[0]?.id || "unknown",
				strength: 0.7,
				type: determineConnectionType(sourceSystem, targetSystem, connection),
				description: `Connection between ${sourceSystem.name} and ${targetSystem.name}`,
				polishDescription: `Połączenie między ${sourceSystem.polishName} a ${targetSystem.polishName}`,
				path: {
					points: [
						{ x: 0, y: 0, z: 0 },
						{ x: 0.5, y: 0.5, z: 0.5 },
						{ x: 1, y: 1, z: 1 },
					],
					curvature: 0.5,
					animation: "flow",
					speed: 1.0,
				},
			});
		}
	});

	return connections;
}

function determineConnectionType(
	sourceSystem: BodySystem,
	targetSystem: BodySystem,
	connection: string,
): SystemConnection["type"] {
	// Simple heuristic to determine connection type
	if (
		connection.toLowerCase().includes("nervous") ||
		connection.toLowerCase().includes("nerwowy")
	) {
		return "neural";
	}
	if (
		connection.toLowerCase().includes("vascular") ||
		connection.toLowerCase().includes("naczyniowy")
	) {
		return "vascular";
	}
	if (
		connection.toLowerCase().includes("hormonal") ||
		connection.toLowerCase().includes("hormon")
	) {
		return "hormonal";
	}
	if (
		connection.toLowerCase().includes("functional") ||
		connection.toLowerCase().includes("funkcj")
	) {
		return "functional";
	}
	return "structural";
}
