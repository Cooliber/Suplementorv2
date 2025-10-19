\"use client\";

/**
 * Enhanced 3D Brain Visualization Component
 *
 * Interactive 3D brain model with Polish labels, AR support, and supplement interactions
 * Features:
 * - Polish brain region labels and descriptions
 * - Interactive hover/click tooltips
 * - Supplement effect visualization
 * - AR mode simulation
 * - Accessibility features
 * - Performance optimizations
 */

import { Html, OrbitControls, useFrame } from \"@react-three/drei\";
import { Canvas, useThree } from \"@react-three/fiber\";
import { Badge } from \"@/components/ui/badge\";
import { Button } from \"@/components/ui/button\";
import { Card, CardContent } from \"@/components/ui/card\";
import {
  Brain,
  Eye,
  EyeOff,
  RotateCcw,
  Smartphone,
  Zap,
} from \"lucide-react\";
import { useEffect, useMemo, useRef, useState } from \"react\";
import * as THREE from \"three\";

import { use3DPerformanceOptimizations, useThrottle } from \"@/lib/performance-optimizations\";

// Polish brain region data
export interface BrainRegionData {
  id: string;
  name: string; // Polish name
  englishName: string;
  description: string; // Polish description
  functions: string[]; // Polish functions
  color: string;
  position: [number, number, number];
  size: number;
  connections: string[]; // Connected regions
}

const BRAIN_REGIONS: BrainRegionData[] = [
  {
    id: \"frontal-lobe\",
    name: \"Płat czołowy\",
    englishName: \"Frontal Lobe\",
    description: \"Odpowiedzialny za myślenie, planowanie i kontrolę zachowania\",
    functions: [
      \"Funkcje wykonawcze\",
      \"Kontrola impulsów\",
      \"Podejmowanie decyzji\",
      \"Planowanie\"
    ],
    color: \"#FF6B6B\",
    position: [0, 2, 1],
    size: 1.2,
    connections: [\"parietal-lobe\", \"temporal-lobe\", \"prefrontal-cortex\"]
  },
  {
    id: \"parietal-lobe\",
    name: \"Płat ciemieniowy\",
    englishName: \"Parietal Lobe\",
    description: \"Przetwarza informacje sensoryczne i orientację przestrzenną\",
    functions: [
      \"Czucie dotyku\",
      \"Orientacja przestrzenna\",
      \"Percepcja wzrokowa\",
      \"Uwaga\"
    ],
    color: \"#4ECDC4\",
    position: [1.5, 0.5, 0.5],
    size: 1.0,
    connections: [\"frontal-lobe\", \"occipital-lobe\"]
  },
  {
    id: \"temporal-lobe\",
    name: \"Płat skroniowy\",
    englishName: \"Temporal Lobe\",
    description: \"Odpowiedzialny za pamięć, słyszenie i przetwarzanie języka\",
    functions: [
      \"Pamięć\",
      \"Słyszenie\",
      \"Rozumienie języka\",
      \"Emocje\"
    ],
    color: \"#45B7D1\",
    position: [1.2, -1, -0.5],
    size: 0.9,
    connections: [\"frontal-lobe\", \"hippocampus\"]
  },
  {
    id: \"occipital-lobe\",
    name: \"Płat potyliczny\",
    englishName: \"Occipital Lobe\",
    description: \"Przetwarza informacje wzrokowe\",
    functions: [
      \"Wzrok\",
      \"Rozpoznawanie kształtów\",
      \"Kolor\",
      \"Ruch\"
    ],
    color: \"#96CEB4\",
    position: [-1.2, -0.5, -1],
    size: 0.8,
    connections: [\"parietal-lobe\"]
  },
  {
    id: \"prefrontal-cortex\",
    name: \"Kora przedczołowa\",
    englishName: \"Prefrontal Cortex\",
    description: \"Centrum kontroli wykonawczej i funkcji poznawczych\",
    functions: [
      \"Kontrola emocji\",
      \"Planowanie długoterminowe\",
      \"Rozwiązywanie problemów\",
      \"Pamięć robocza\"
    ],
    color: \"#FFEAA7\",
    position: [0, 3, 1.5],
    size: 0.6,
    connections: [\"frontal-lobe\", \"amygdala\"]
  },
  {
    id: \"hippocampus\",
    name: \"Hipokamp\",
    englishName: \"Hippocampus\",
    description: \"Kluczowy dla formowania nowych wspomnień\",
    functions: [
      \"Pamięć długotrwała\",
      \"Uczenie się\",
      \"Orientacja przestrzenna\",
      \"Nawigacja\"
    ],
    color: \"#DDA0DD\",
    position: [0, -2, -1],
    size: 0.4,
    connections: [\"temporal-lobe\", \"amygdala\"]
  },
  {
    id: \"amygdala\",
    name: \"Migdałowie\",
    englishName: \"Amygdala\",
    description: \"Przetwarza emocje, szczególnie strach i agresję\",
    functions: [
      \"Emocje\",
      \"Strach\",
      \"Agresja\",
      \"Pamięć emocjonalna\"
    ],
    color: \"#FF8C69\",
    position: [0.5, -1.5, -0.5],
    size: 0.3,
    connections: [\"hippocampus\", \"prefrontal-cortex\"]
  }
];

interface BrainRegionProps {
  region: BrainRegionData;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (region: BrainRegionData) => void;
  onHover: (region: BrainRegionData | null) => void;
  supplementEffects?: string[];
}

function BrainRegion({
  region,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  supplementEffects = []
}: BrainRegionProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animation loop
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();

      // Subtle breathing animation
      const scale = 1 + Math.sin(time * 2) * 0.02;
      meshRef.current.scale.setScalar(scale);

      // Pulse effect when selected
      if (isSelected) {
        const pulseScale = 1 + Math.sin(time * 4) * 0.1;
        meshRef.current.scale.setScalar(pulseScale);
      }

      // Rotation for active regions
      if (supplementEffects.length > 0) {
        meshRef.current.rotation.y = Math.sin(time) * 0.1;
      }
    }
  });

  const handleClick = () => {
    onSelect(region);
  };

  const handlePointerOver = () => {
    onHover(region);
  };

  const handlePointerOut = () => {
    onHover(null);
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={region.position}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[region.size, 16, 16]} />
        <meshStandardMaterial
          color={region.color}
          transparent
          opacity={isSelected ? 0.9 : isHovered ? 0.8 : 0.7}
          emissive={supplementEffects.length > 0 ? region.color : \"#000000\"}
          emissiveIntensity={supplementEffects.length > 0 ? 0.2 : 0}
        />
      </mesh>

      {/* Connection lines */}
      {region.connections.map((connectionId) => {
        const connectedRegion = BRAIN_REGIONS.find(r => r.id === connectionId);
        if (!connectedRegion) return null;

        const start = new THREE.Vector3(...region.position);
        const end = new THREE.Vector3(...connectedRegion.position);
        const direction = end.clone().sub(start).normalize();
        const length = start.distanceTo(end);

        return (
          <mesh
            key={`connection-${region.id}-${connectionId}`}
            position={[
              (region.position[0] + connectedRegion.position[0]) / 2,
              (region.position[1] + connectedRegion.position[1]) / 2,
              (region.position[2] + connectedRegion.position[2]) / 2,
            ]}
          >
            <cylinderGeometry args={[0.02, 0.02, length, 8]} />
            <meshBasicMaterial
              color={region.color}
              transparent
              opacity={0.3}
            />
          </mesh>
        );
      })}

      {/* Tooltip */}
      {(isHovered || isSelected) && (
        <Html position={[region.position[0], region.position[1] + region.size + 0.5, region.position[2]]}>
          <Card className=\"w-64 bg-white/95 backdrop-blur-sm border shadow-lg\">
            <CardContent className=\"p-3\">
              <div className=\"space-y-2\">
                <div className=\"flex items-center gap-2\">
                  <Badge variant=\"outline\" className=\"text-xs\">
                    {region.englishName}
                  </Badge>
                  <h4 className=\"font-semibold text-sm\">{region.name}</h4>
                </div>
                <p className=\"text-xs text-gray-600\">{region.description}</p>
                <div className=\"space-y-1\">
                  <p className=\"text-xs font-medium\">Główne funkcje:</p>
                  <div className=\"flex flex-wrap gap-1\">
                    {region.functions.slice(0, 2).map((func, idx) => (
                      <Badge key={idx} variant=\"secondary\" className=\"text-xs\">
                        {func}
                      </Badge>
                    ))}
                  </div>
                </div>
                {supplementEffects.length > 0 && (
                  <div className=\"pt-2 border-t\">
                    <div className=\"flex items-center gap-1 text-xs text-green-600\">
                      <Zap className=\"h-3 w-3\" />
                      Efekty suplementów
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Html>
      )}
    </group>
  );
}

interface Brain3DProps {
  selectedRegion?: string;
  onRegionSelect?: (regionId: string) => void;
  supplementEffects?: Record<string, string[]>; // regionId -> effects
  showLabels?: boolean;
  enableAR?: boolean;
  className?: string;
}

export function Brain3D({
  selectedRegion,
  onRegionSelect,
  supplementEffects = {},
  showLabels = true,
  enableAR = false,
  className = \"\"
}: Brain3DProps) {
  const [hoveredRegion, setHoveredRegion] = useState<BrainRegionData | null>(null);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'first-person'>('orbit');
  const [showConnections, setShowConnections] = useState(true);

  // Performance optimizations
  const { performanceMode, qualitySettings } = use3DPerformanceOptimizations();

  // Throttled hover handler for performance
  const throttledSetHoveredRegion = useThrottle((region: BrainRegionData | null) => {
    setHoveredRegion(region);
  }, 16);

  const handleRegionSelect = (region: BrainRegionData) => {
    onRegionSelect?.(region.id);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Controls */}
      <div className=\"absolute top-4 left-4 z-10 flex gap-2\">
        <Button
          variant={cameraMode === 'orbit' ? 'default' : 'outline'}
          size=\"sm\"
          onClick={() => setCameraMode('orbit')}
        >
          <RotateCcw className=\"h-4 w-4\" />
        </Button>
        <Button
          variant={showConnections ? 'default' : 'outline'}
          size=\"sm\"
          onClick={() => setShowConnections(!showConnections)}
        >
          {showConnections ? <Eye className=\"h-4 w-4\" /> : <EyeOff className=\"h-4 w-4\" />}
        </Button>
        {enableAR && (
          <Button variant=\"outline\" size=\"sm\">
            <Smartphone className=\"h-4 w-4\" />
            AR
          </Button>
        )}
      </div>

      {/* Canvas with performance optimizations */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        className=\"rounded-lg border bg-gradient-to-b from-blue-50 to-white\"
        dpr={qualitySettings.pixelRatio}
        gl={{
          antialias: qualitySettings.antialias,
          alpha: true,
          powerPreference: performanceMode === 'high' ? 'high-performance' : 'default',
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.4} />

        {cameraMode === 'orbit' && <OrbitControls enablePan={true} enableZoom={true} />}

        {/* Brain Regions with performance optimizations */}
        {BRAIN_REGIONS.map((region) => {
          // Only render regions that are likely to be visible or active
          const shouldRender = selectedRegion === region.id ||
                              hoveredRegion?.id === region.id ||
                              supplementEffects[region.id]?.length > 0 ||
                              performanceMode === 'high';

          if (!shouldRender && performanceMode === 'low') {
            return null;
          }

          return (
            <BrainRegion
              key={region.id}
              region={region}
              isSelected={selectedRegion === region.id}
              isHovered={hoveredRegion?.id === region.id}
              onSelect={handleRegionSelect}
              onHover={throttledSetHoveredRegion}
              supplementEffects={supplementEffects[region.id] || []}
            />
          );
        })}

        {/* Labels with performance optimization */}
        {showLabels && BRAIN_REGIONS.map((region) => {
          // Hide labels for distant regions in low performance mode
          if (performanceMode === 'low' && region.position[2] < -0.5) {
            return null;
          }

          return (
            <Html
              key={`label-${region.id}`}
              position={[region.position[0], region.position[1] + region.size + 0.2, region.position[2]]}
            >
              <div className=\"text-xs font-medium text-gray-700 bg-white/80 px-2 py-1 rounded shadow-sm\">
                {region.name}
              </div>
            </Html>
          );
        })}
      </Canvas>

      {/* Info Panel */}
      {hoveredRegion && (
        <div className=\"absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80\">
          <Card className=\"bg-white/95 backdrop-blur-sm border shadow-lg\">
            <CardContent className=\"p-4\">
              <div className=\"flex items-start gap-3\">
                <div
                  className=\"w-4 h-4 rounded-full flex-shrink-0 mt-1\"
                  style={{ backgroundColor: hoveredRegion.color }}
                />
                <div className=\"flex-1\">
                  <h4 className=\"font-semibold\">{hoveredRegion.name}</h4>
                  <p className=\"text-sm text-gray-600 mb-2\">{hoveredRegion.description}</p>
                  <div className=\"flex flex-wrap gap-1\">
                    {hoveredRegion.functions.map((func, idx) => (
                      <Badge key={idx} variant=\"secondary\" className=\"text-xs\">
                        {func}
                      </Badge>
                    ))}
                  </div>
                  {supplementEffects[hoveredRegion.id]?.length > 0 && (
                    <div className=\"mt-2 pt-2 border-t\">
                      <div className=\"flex items-center gap-1 text-sm text-green-600\">
                        <Zap className=\"h-3 w-3\" />
                        Aktywne efekty suplementów
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// AR Mode Simulation Component
export function BrainARMode({ onExit }: { onExit: () => void }) {
  return (
    <div className=\"fixed inset-0 bg-black z-50 flex items-center justify-center\">
      <div className=\"text-center text-white space-y-4\">
        <Brain className=\"h-16 w-16 mx-auto text-blue-400\" />
        <h2 className=\"text-2xl font-bold\">Tryb AR Mózgu</h2>
        <p className=\"text-gray-300 max-w-md\">
          W rzeczywistości, ten tryb pozwalałby na nakładanie wizualizacji mózgu
          na rzeczywisty świat za pomocą aparatu urządzenia.
        </p>
        <div className=\"flex gap-4 justify-center\">
          <Button onClick={onExit} variant=\"outline\">
            Wróć do trybu 3D
          </Button>
          <Button>
            <Smartphone className=\"h-4 w-4 mr-2\" />
            Uruchom AR (Symulacja)
          </Button>
        </div>
      </div>
    </div>
  );
}
