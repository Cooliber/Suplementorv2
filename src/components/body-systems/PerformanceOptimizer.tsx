"use client";

import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";

// Performance monitoring hook
export const usePerformanceMonitor = () => {
	const [fps, setFps] = useState(60);
	const [memoryUsage, setMemoryUsage] = useState(0);
	const [renderTime, setRenderTime] = useState(0);

	useFrame(() => {
		// Monitor FPS
		const now = performance.now();
		setFps((prevFps) => {
			const newFps = 1000 / (now - (prevFps as any).lastTime || now);
			(prevFps as any).lastTime = now;
			return newFps;
		});

		// Monitor memory usage (if available)
		if ("memory" in performance) {
			setMemoryUsage((performance as any).memory.usedJSHeapSize / 1024 / 1024);
		}
	});

	return { fps, memoryUsage, renderTime };
};

// LOD (Level of Detail) management
export const useLOD = (distance: number, thresholds = [10, 25, 50]) => {
	const [lodLevel, setLodLevel] = useState(0);

	useEffect(() => {
		if (distance < thresholds[0]) {
			setLodLevel(0); // High detail
		} else if (distance < thresholds[1]) {
			setLodLevel(1); // Medium detail
		} else if (distance < thresholds[2]) {
			setLodLevel(2); // Low detail
		} else {
			setLodLevel(3); // Very low detail
		}
	}, [distance, thresholds]);

	return lodLevel;
};

// Frustum culling for performance
export const useFrustumCulling = (
	position: [number, number, number],
	bounds = 1,
) => {
	const { camera } = useThree();
	const [isVisible, setIsVisible] = useState(true);

	useFrame(() => {
		const distance = camera.position.distanceTo(new THREE.Vector3(...position));

		// Simple distance-based culling
		const maxDistance = 50; // Configurable
		setIsVisible(distance < maxDistance);
	});

	return isVisible;
};

// Instanced rendering for multiple similar objects
export const useInstancedRendering = <T,>(
	objects: T[],
	maxInstances = 1000,
) => {
	const instances = useMemo(() => {
		// Group objects for instanced rendering
		const groups = [];
		for (let i = 0; i < objects.length; i += maxInstances) {
			groups.push(objects.slice(i, i + maxInstances));
		}
		return groups;
	}, [objects, maxInstances]);

	return instances;
};

// Texture optimization
export const useTextureOptimization = (textureUrl: string, quality = 0.8) => {
	const optimizedTexture = useMemo(() => {
		// In a real implementation, this would compress/optimize the texture
		return {
			url: textureUrl,
			quality,
			mipmap: true,
			anisotropy: 4,
		};
	}, [textureUrl, quality]);

	return optimizedTexture;
};

// Animation performance optimization
export const useOptimizedAnimation = (enabled: boolean, frameSkip = 2) => {
	const frameCount = useRef(0);

	useFrame((state) => {
		if (!enabled) return;

		frameCount.current++;

		// Skip frames for better performance
		if (frameCount.current % frameSkip !== 0) return;

		// Optimized animation logic here
	});

	return { frameCount: frameCount.current };
};

// Memory management utilities
export const useMemoryManagement = () => {
	const cleanup = useCallback(() => {
		// Force garbage collection if available
		if ("gc" in window) {
			(window as any).gc();
		}
	}, []);

	const getMemoryInfo = useCallback(() => {
		if ("memory" in performance) {
			const memory = (performance as any).memory;
			return {
				used: memory.usedJSHeapSize / 1024 / 1024,
				total: memory.totalJSHeapSize / 1024 / 1024,
				limit: memory.jsHeapSizeLimit / 1024 / 1024,
			};
		}
		return null;
	}, []);

	return { cleanup, getMemoryInfo };
};

// Performance monitoring component
export const PerformanceMonitor: React.FC<{
	isVisible: boolean;
	position?: [number, number, number];
}> = ({ isVisible, position = [0, 0, 0] }) => {
	const { fps, memoryUsage } = usePerformanceMonitor();

	if (!isVisible) return null;

	return (
		<div
			className="fixed top-4 left-4 rounded bg-black/80 p-2 font-mono text-white text-xs"
			style={{
				position: "fixed",
				top: "1rem",
				left: "1rem",
				zIndex: 1000,
			}}
		>
			<div>FPS: {fps.toFixed(1)}</div>
			<div>Memory: {memoryUsage.toFixed(1)} MB</div>
		</div>
	);
};

// Adaptive quality settings based on performance
export const useAdaptiveQuality = () => {
	const { fps } = usePerformanceMonitor();
	const [quality, setQuality] = useState(1);

	useEffect(() => {
		if (fps < 30) {
			setQuality((prev) => Math.max(0.3, prev - 0.1));
		} else if (fps > 50) {
			setQuality((prev) => Math.min(1, prev + 0.05));
		}
	}, [fps]);

	return quality;
};

// WebGL context loss handling
export const useWebGLContext = () => {
	const { gl } = useThree();
	const [contextLost, setContextLost] = useState(false);

	useEffect(() => {
		const handleContextLoss = (event: Event) => {
			event.preventDefault();
			setContextLost(true);
			console.warn("WebGL context lost");
		};

		const handleContextRestore = () => {
			setContextLost(false);
			console.log("WebGL context restored");
		};

		gl.canvas.addEventListener("webglcontextlost", handleContextLoss);
		gl.canvas.addEventListener("webglcontextrestored", handleContextRestore);

		return () => {
			gl.canvas.removeEventListener("webglcontextlost", handleContextLoss);
			gl.canvas.removeEventListener(
				"webglcontextrestored",
				handleContextRestore,
			);
		};
	}, [gl]);

	return { contextLost };
};

// Performance optimization component that wraps children
export const PerformanceOptimizer: React.FC<{
	children: React.ReactNode;
	enableLOD?: boolean;
	enableFrustumCulling?: boolean;
	maxFPS?: number;
}> = ({
	children,
	enableLOD = true,
	enableFrustumCulling = true,
	maxFPS = 60,
}) => {
	const quality = useAdaptiveQuality();
	const { contextLost } = useWebGLContext();

	// Reduce frame rate if needed
	useFrame(() => {
		// Frame rate limiting logic would go here
	});

	if (contextLost) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<h3 className="mb-2 font-medium text-gray-900 text-lg">
						Problem z renderingiem 3D
					</h3>
					<p className="mb-4 text-gray-600">
						Wystąpił problem z kontekstem WebGL. Spróbuj odświeżyć stronę.
					</p>
					<button
						onClick={() => window.location.reload()}
						className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					>
						Odśwież stronę
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			{children}
			{/* Performance monitoring overlay can be added here */}
		</>
	);
};

// Utility for preloading assets
export const useAssetPreloader = (assets: string[]) => {
	const [loaded, setLoaded] = useState(0);
	const [total] = useState(assets.length);

	useEffect(() => {
		const loadAsset = (url: string): Promise<void> => {
			return new Promise((resolve) => {
				if (url.endsWith(".glb") || url.endsWith(".gltf")) {
					// 3D model loading
					const loader = new THREE.GLTFLoader();
					loader.load(
						url,
						() => resolve(),
						undefined,
						() => resolve(),
					);
				} else if (url.endsWith(".jpg") || url.endsWith(".png")) {
					// Texture loading
					const img = new Image();
					img.onload = () => resolve();
					img.onerror = () => resolve();
					img.src = url;
				} else {
					resolve();
				}
			});
		};

		Promise.all(assets.map(loadAsset)).then(() => {
			setLoaded(total);
		});
	}, [assets, total]);

	return { loaded, total, progress: total > 0 ? (loaded / total) * 100 : 0 };
};

// Batch rendering for multiple objects
export const useBatchRendering = <T,>(objects: T[], batchSize = 50) => {
	const batches = useMemo(() => {
		const result = [];
		for (let i = 0; i < objects.length; i += batchSize) {
			result.push(objects.slice(i, i + batchSize));
		}
		return result;
	}, [objects, batchSize]);

	return batches;
};

// Performance budget monitoring
export const usePerformanceBudget = (budget = { fps: 30, memory: 100 }) => {
	const { fps, memoryUsage } = usePerformanceMonitor();
	const [withinBudget, setWithinBudget] = useState(true);

	useEffect(() => {
		const fpsOk = fps >= budget.fps;
		const memoryOk = memoryUsage <= budget.memory;

		setWithinBudget(fpsOk && memoryOk);
	}, [fps, memoryUsage, budget]);

	return { withinBudget, fps, memoryUsage };
};
