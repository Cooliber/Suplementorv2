"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Brain } from "lucide-react";
import { Suspense } from "react";

// Simple brain representation for preview
function BrainModel() {
	return (
		<group>
			{/* Simplified brain shape using basic geometries */}
			<mesh position={[0, 0, 0]}>
				<sphereGeometry args={[1.2, 32, 32]} />
				<meshStandardMaterial
					color="#8B5CF6"
					transparent
					opacity={0.8}
					roughness={0.3}
					metalness={0.1}
				/>
			</mesh>

			{/* Brain hemispheres */}
			<mesh position={[-0.3, 0, 0]}>
				<sphereGeometry args={[0.9, 16, 16]} />
				<meshStandardMaterial
					color="#A855F7"
					transparent
					opacity={0.6}
					roughness={0.4}
				/>
			</mesh>

			<mesh position={[0.3, 0, 0]}>
				<sphereGeometry args={[0.9, 16, 16]} />
				<meshStandardMaterial
					color="#A855F7"
					transparent
					opacity={0.6}
					roughness={0.4}
				/>
			</mesh>

			{/* Cerebellum */}
			<mesh position={[0, -0.8, -0.5]}>
				<sphereGeometry args={[0.4, 16, 16]} />
				<meshStandardMaterial color="#7C3AED" transparent opacity={0.7} />
			</mesh>
		</group>
	);
}

function BrainScene() {
	return (
		<>
			<PerspectiveCamera makeDefault position={[0, 0, 5]} />
			<OrbitControls
				enableZoom={false}
				enablePan={false}
				autoRotate
				autoRotateSpeed={1}
			/>

			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<directionalLight position={[10, 10, 5]} intensity={1} castShadow />
			<pointLight position={[-10, -10, -5]} intensity={0.5} />

			<Suspense fallback={null}>
				<BrainModel />
			</Suspense>
		</>
	);
}

export function BrainVisualizationPreview() {
	return (
		<div className="relative h-96 w-96 overflow-hidden rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900">
			<Canvas
				shadows
				camera={{ position: [0, 0, 5], fov: 50 }}
				className="h-full w-full"
			>
				<BrainScene />
			</Canvas>

			{/* Overlay with Polish labels */}
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute top-4 left-4 rounded-lg bg-white/90 px-3 py-2 font-medium text-sm dark:bg-gray-800/90">
					<Brain className="mr-1 inline h-4 w-4" />
					Płat czołowy
				</div>
				<div className="absolute right-4 bottom-4 rounded-lg bg-white/90 px-3 py-2 font-medium text-sm dark:bg-gray-800/90">
					Móżdżek
				</div>
				<div className="absolute top-1/2 right-4 rounded-lg bg-white/90 px-3 py-2 font-medium text-sm dark:bg-gray-800/90">
					Hipokamp
				</div>
			</div>

			{/* Interactive hint */}
			<div className="absolute bottom-4 left-4 rounded-lg bg-blue-600 px-3 py-2 font-medium text-sm text-white">
				Kliknij aby eksplorować →
			</div>
		</div>
	);
}
