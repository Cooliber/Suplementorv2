/**
 * 3D Model Optimization Utilities for Medical App
 * Handles compression, LOD generation, and performance optimization
 */

import * as THREE from 'three';

export interface ModelOptimizationOptions {
	compressGeometry?: boolean;
	generateLOD?: boolean;
	optimizeMaterials?: boolean;
	targetPolygonCount?: number;
	compressTextures?: boolean;
}

export interface OptimizedModel {
	geometry: THREE.BufferGeometry;
	materials: THREE.Material[];
	lodLevels?: THREE.LOD[];
	originalSize: number;
	optimizedSize: number;
	compressionRatio: number;
}

/**
 * Compresses geometry by reducing polygon count
 */
export function compressGeometry(
	geometry: THREE.BufferGeometry,
	targetCount?: number
): THREE.BufferGeometry {
	const positionAttribute = geometry.getAttribute('position');
	if (!positionAttribute) return geometry;

	const originalCount = positionAttribute.count;
	const vertices = positionAttribute.array as Float32Array;

	// Simple decimation algorithm
	if (targetCount && originalCount > targetCount) {
		const ratio = targetCount / originalCount;
		const newCount = Math.floor(originalCount * ratio);

		// Create new geometry with reduced vertices
		const newPositions = new Float32Array(newCount * 3);

		for (let i = 0; i < newCount; i++) {
			const sourceIndex = Math.floor((i / newCount) * originalCount);
			const sourceOffset = sourceIndex * 3;

			newPositions[i * 3] = vertices[sourceOffset];
			newPositions[i * 3 + 1] = vertices[sourceOffset + 1];
			newPositions[i * 3 + 2] = vertices[sourceOffset + 2];
		}

		const newGeometry = geometry.clone();
		newGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
		newGeometry.computeVertexNormals();

		return newGeometry;
	}

	return geometry;
}

/**
 * Generates Level of Detail (LOD) for a mesh
 */
export function generateLOD(
	mesh: THREE.Mesh,
	levels: { distance: number; polygons: number }[] = [
		{ distance: 0, polygons: 1.0 },
		{ distance: 50, polygons: 0.5 },
		{ distance: 100, polygons: 0.25 },
		{ distance: 200, polygons: 0.1 }
	]
): THREE.LOD {
	const lod = new THREE.LOD();

	levels.forEach((level, index) => {
		if (index === 0) {
			// Original mesh for closest level
			lod.addLevel(mesh.clone(), level.distance);
		} else {
			// Create simplified geometry for distant levels
			const simplifiedGeometry = compressGeometry(
				mesh.geometry,
				Math.floor(mesh.geometry.attributes.position.count * level.polygons)
			);

			const simplifiedMesh = new THREE.Mesh(simplifiedGeometry, mesh.material);
			lod.addLevel(simplifiedMesh, level.distance);
		}
	});

	return lod;
}

/**
 * Optimizes materials for better performance
 */
export function optimizeMaterials(materials: THREE.Material[]): THREE.Material[] {
	return materials.map(material => {
		// Clone material to avoid modifying original
		const optimizedMaterial = material.clone();

		// Disable expensive features for better performance
		if (optimizedMaterial instanceof THREE.MeshStandardMaterial) {
			// Reduce environment map intensity
			optimizedMaterial.envMapIntensity = Math.min(optimizedMaterial.envMapIntensity || 1, 0.5);

			// Disable normal maps for distant objects
			if (optimizedMaterial.normalMap) {
				optimizedMaterial.normalScale.set(0.5, 0.5);
			}
		}

		// Enable flat shading for better performance on simple geometry
		if (optimizedMaterial instanceof THREE.MeshLambertMaterial) {
			optimizedMaterial.flatShading = true;
		}

		return optimizedMaterial;
	});
}

/**
 * Compresses textures for better memory usage
 */
export function compressTexture(texture: THREE.Texture): THREE.Texture {
	// Set appropriate texture parameters for compression
	texture.generateMipmaps = true;
	texture.minFilter = THREE.LinearMipmapLinearFilter;
	texture.magFilter = THREE.LinearFilter;

	// Use appropriate texture format
	if (texture.image) {
		// For medical textures, prioritize quality over size
		texture.format = THREE.RGBAFormat;
		texture.type = THREE.UnsignedByteType;
	}

	return texture;
}

/**
 * Main model optimization function
 */
export function optimizeModel(
	scene: THREE.Object3D,
	options: ModelOptimizationOptions = {}
): OptimizedModel {
	const {
		compressGeometry: shouldCompressGeometry = true,
		generateLOD: shouldGenerateLOD = true,
		optimizeMaterials: shouldOptimizeMaterials = true,
		targetPolygonCount,
		compressTextures: shouldCompressTextures = true,
	} = options;

	console.log('🧠 Starting model optimization...');

	// Calculate original size
	const originalSize = calculateModelSize(scene);

	let optimizedGeometry: THREE.BufferGeometry;
	let optimizedMaterials: THREE.Material[];
	let lodLevels: THREE.LOD[] | undefined;

	// Process geometry
	if (scene instanceof THREE.Mesh) {
		optimizedGeometry = shouldCompressGeometry
			? compressGeometry(scene.geometry, targetPolygonCount)
			: scene.geometry;

		optimizedMaterials = shouldOptimizeMaterials
			? optimizeMaterials(Array.isArray(scene.material) ? scene.material : [scene.material])
			: (Array.isArray(scene.material) ? scene.material : [scene.material]);

		// Generate LOD if requested
		if (shouldGenerateLOD) {
			const lod = generateLOD(scene);
			lodLevels = [lod];
		}
	} else {
		// For groups or other objects, process children recursively
		scene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.geometry = shouldCompressGeometry
					? compressGeometry(child.geometry, targetPolygonCount)
					: child.geometry;

				if (shouldOptimizeMaterials) {
					child.material = Array.isArray(child.material)
						? optimizeMaterials(child.material)
						: optimizeMaterials([child.material]);
				}
			}
		});

		optimizedGeometry = new THREE.BufferGeometry(); // Placeholder
		optimizedMaterials = [];
	}

	// Process textures
	if (shouldCompressTextures) {
		scene.traverse((child) => {
			if (child instanceof THREE.Mesh && child.material) {
				const materials = Array.isArray(child.material) ? child.material : [child.material];

				materials.forEach(material => {
					['map', 'normalMap', 'roughnessMap', 'metalnessMap'].forEach(mapName => {
						const map = (material as any)[mapName];
						if (map instanceof THREE.Texture) {
							compressTexture(map);
						}
					});
				});
			}
		});
	}

	// Calculate optimized size
	const optimizedSize = calculateModelSize(scene);
	const compressionRatio = originalSize > 0 ? optimizedSize / originalSize : 1;

	console.log(`✅ Model optimization completed:`);
	console.log(`  Original size: ${formatBytes(originalSize)}`);
	console.log(`  Optimized size: ${formatBytes(optimizedSize)}`);
	console.log(`  Compression ratio: ${(compressionRatio * 100).toFixed(1)}%`);

	return {
		geometry: optimizedGeometry,
		materials: optimizedMaterials,
		lodLevels,
		originalSize,
		optimizedSize,
		compressionRatio,
	};
}

/**
 * Calculates the memory size of a 3D model
 */
function calculateModelSize(object: THREE.Object3D): number {
	let totalSize = 0;

	object.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			// Geometry size
			if (child.geometry) {
				Object.values(child.geometry.attributes).forEach(attribute => {
					if (attribute instanceof THREE.BufferAttribute) {
						totalSize += attribute.array.byteLength;
					}
				});

				// Index size
				if (child.geometry.index) {
					totalSize += child.geometry.index.array.byteLength;
				}
			}

			// Material size (estimated)
			if (child.material) {
				const materials = Array.isArray(child.material) ? child.material : [child.material];
				materials.forEach(material => {
					// Estimate texture memory usage
					['map', 'normalMap', 'roughnessMap', 'metalnessMap'].forEach(mapName => {
						const map = (material as any)[mapName];
						if (map instanceof THREE.Texture && map.image) {
							totalSize += (map.image.width || 512) * (map.image.height || 512) * 4; // RGBA
						}
					});
				});
			}
		}
	});

	return totalSize;
}

/**
 * Formats bytes into human readable format
 */
function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Preloads and caches optimized models
 */
class ModelCache {
	private cache = new Map<string, OptimizedModel>();
	private loadingPromises = new Map<string, Promise<OptimizedModel>>();

	async getOptimizedModel(
		modelPath: string,
		options: ModelOptimizationOptions = {}
	): Promise<OptimizedModel> {
		// Check cache first
		if (this.cache.has(modelPath)) {
			return this.cache.get(modelPath)!;
		}

		// Check if already loading
		if (this.loadingPromises.has(modelPath)) {
			return this.loadingPromises.get(modelPath)!;
		}

		// Load and optimize
		const loadingPromise = this.loadAndOptimizeModel(modelPath, options);
		this.loadingPromises.set(modelPath, loadingPromise);

		try {
			const optimizedModel = await loadingPromise;
			this.cache.set(modelPath, optimizedModel);
			return optimizedModel;
		} finally {
			this.loadingPromises.delete(modelPath);
		}
	}

	private async loadAndOptimizeModel(
		modelPath: string,
		options: ModelOptimizationOptions
	): Promise<OptimizedModel> {
		// Load GLTF model
		const loader = new THREE.GLTFLoader();

		return new Promise((resolve, reject) => {
			loader.load(
				modelPath,
				(gltf) => {
					try {
						const optimizedModel = optimizeModel(gltf.scene, options);
						resolve(optimizedModel);
					} catch (error) {
						reject(error);
					}
				},
				undefined,
				reject
			);
		});
	}

	clearCache(): void {
		this.cache.clear();
		this.loadingPromises.clear();
	}
}

export const modelCache = new ModelCache();

/**
 * Hook for using optimized models in React components
 */
export function useOptimizedModel(
	modelPath: string,
	options: ModelOptimizationOptions = {}
) {
	const [model, setModel] = useState<OptimizedModel | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;

		const loadModel = async () => {
			try {
				setLoading(true);
				setError(null);

				const optimizedModel = await modelCache.getOptimizedModel(modelPath, options);

				if (mounted) {
					setModel(optimizedModel);
					setLoading(false);
				}
			} catch (err) {
				if (mounted) {
					setError(err instanceof Error ? err.message : 'Failed to load model');
					setLoading(false);
				}
			}
		};

		loadModel();

		return () => {
			mounted = false;
		};
	}, [modelPath, JSON.stringify(options)]);

	return { model, loading, error };
}