// Advanced Cellular Visualization Components
export { default as AdvancedCellularVisualization } from "./AdvancedCellularVisualization";

// Existing visualization components
export { default as MolecularInteractionVisualizer } from "./MolecularInteractionVisualizer";
export { default as CellularUptakeAnimation } from "./CellularUptakeAnimation";
export { default as ReceptorBindingAnimation } from "./ReceptorBindingAnimation";
export { default as MetabolicPathwayVisualization } from "./MetabolicPathwayVisualization";

// Re-export particle system classes for advanced usage
export {
	CellularParticleSystem,
	CELLULAR_PARTICLE_SYSTEMS,
} from "@/lib/animations/cellular-particle-systems";
export {
	MolecularInteractionSystem,
	MOLECULAR_INTERACTION_SYSTEMS,
} from "@/lib/animations/molecular-interaction-systems";
export {
	PhysiologicalSimulationSystem,
	PHYSIOLOGICAL_SIMULATIONS,
} from "@/lib/animations/physiological-process-simulations";
export {
	AdvancedPhysicsEngine,
	BIOLOGICAL_PHYSICS_CONFIGS,
} from "@/lib/animations/advanced-physics-engine";
export { PolishLanguageManager } from "@/lib/animations/polish-language-integration";
