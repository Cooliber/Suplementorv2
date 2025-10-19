// Base types for comprehensive body systems interactive diagrams

export interface AnatomicalStructure {
	id: string;
	name: string;
	polishName: string;
	position: [number, number, number];
	color: string;
	size: number;
	category: BodySystem;
	system: string;
	polishSystem: string;
}

export interface BodySystem {
	id: string;
	name: string;
	polishName: string;
	color: string;
	icon: string;
	description: string;
	polishDescription: string;
	organs: string[];
	polishOrgans: string[];
}

export interface OrganDetail {
	id: string;
	name: string;
	polishName: string;
	functions: string[];
	polishFunctions: string[];
	anatomicalInfo: {
		weight?: number; // grams
		volume?: number; // cm³
		location: string;
		polishLocation: string;
		connections: string[];
		polishConnections: string[];
	};
	supplementEffects: SupplementEffect[];
	clinicalRelevance: string;
	polishClinicalRelevance: string;
}

export interface SupplementEffect {
	supplementId: string;
	supplementName: string;
	polishSupplementName: string;
	effectType: "SUPPORTS" | "ENHANCES" | "PROTECTS" | "REGULATES" | "STIMULATES";
	intensity: number; // 0-1
	mechanism: string;
	polishMechanism: string;
	evidenceLevel: "HIGH" | "MODERATE" | "LOW";
	visualEffect: {
		color: string;
		pulseSpeed: number;
		glowIntensity: number;
	};
}

export interface AnimationConfig {
	speed: number;
	intensity: number;
	showPathways: boolean;
	showLabels: boolean;
	showConnections: boolean;
}

export interface InteractionConfig {
	enableHover: boolean;
	enableClick: boolean;
	enableZoom: boolean;
	enablePan: boolean;
	enableRotate: boolean;
	touchOptimized: boolean;
}

export interface AccessibilityConfig {
	screenReaderSupport: boolean;
	highContrast: boolean;
	reducedMotion: boolean;
	largeText: boolean;
	keyboardNavigation: boolean;
}

export interface ViewMode {
	id: string;
	name: string;
	polishName: string;
	cameraPosition: [number, number, number];
	cameraTarget: [number, number, number];
	showInternal: boolean;
	showExternal: boolean;
	showSkeleton: boolean;
	showMuscles: boolean;
	showOrgans: boolean;
}

export interface CrossSection {
	id: string;
	name: string;
	polishName: string;
	plane: "sagittal" | "coronal" | "transverse";
	position: number;
	visibleStructures: string[];
	description: string;
	polishDescription: string;
}

// Body systems definitions
export const BODY_SYSTEMS: BodySystem[] = [
	{
		id: "skeletal",
		name: "Skeletal System",
		polishName: "Układ szkieletowy",
		color: "#E5E7EB",
		icon: "Bone",
		description: "Provides structure, support, and protection for the body",
		polishDescription: "Zapewnia strukturę, wsparcie i ochronę dla organizmu",
		organs: ["Skull", "Spine", "Ribs", "Pelvis", "Long bones"],
		polishOrgans: ["Czaszka", "Kręgosłup", "Żebra", "Miednica", "Kości długie"],
	},
	{
		id: "muscular",
		name: "Muscular System",
		polishName: "Układ mięśniowy",
		color: "#DC2626",
		icon: "Activity",
		description: "Enables movement and maintains posture",
		polishDescription: "Umożliwia ruch i utrzymuje postawę",
		organs: ["Skeletal muscles", "Smooth muscles", "Cardiac muscle"],
		polishOrgans: ["Mięśnie szkieletowe", "Mięśnie gładkie", "Mięsień sercowy"],
	},
	{
		id: "respiratory",
		name: "Respiratory System",
		polishName: "Układ oddechowy",
		color: "#2563EB",
		icon: "Wind",
		description: "Facilitates gas exchange between blood and air",
		polishDescription: "Umożliwia wymianę gazową między krwią a powietrzem",
		organs: ["Lungs", "Trachea", "Bronchi", "Diaphragm"],
		polishOrgans: ["Płuca", "Tchawica", "Oskrzela", "Przepona"],
	},
	{
		id: "nervous",
		name: "Nervous System",
		polishName: "Układ nerwowy",
		color: "#7C3AED",
		icon: "Zap",
		description: "Controls body functions and processes information",
		polishDescription: "Kontroluje funkcje organizmu i przetwarza informacje",
		organs: ["Brain", "Spinal cord", "Nerves", "Sensory organs"],
		polishOrgans: ["Mózg", "Rdzeń kręgowy", "Nerwy", "Narządy zmysłów"],
	},
	{
		id: "endocrine",
		name: "Endocrine System",
		polishName: "Układ hormonalny",
		color: "#059669",
		icon: "CircleDot",
		description: "Regulates hormones and metabolic processes",
		polishDescription: "Reguluje hormony i procesy metaboliczne",
		organs: ["Pituitary", "Thyroid", "Adrenals", "Pancreas", "Gonads"],
		polishOrgans: ["Przysadka", "Tarczyca", "Nadnercza", "Trzustka", "Gonady"],
	},
	{
		id: "reproductive",
		name: "Reproductive System",
		polishName: "Układ rozrodczy",
		color: "#BE123C",
		icon: "Heart",
		description: "Enables reproduction and hormone production",
		polishDescription: "Umożliwia reprodukcję i produkcję hormonów",
		organs: ["Testes/Ovaries", "Uterus", "Prostate", "Mammary glands"],
		polishOrgans: ["Jądra/Jajniki", "Macica", "Prostata", "Gruczoły sutkowe"],
	},
	{
		id: "integumentary",
		name: "Integumentary System",
		polishName: "Układ powłokowy",
		color: "#F59E0B",
		icon: "Shield",
		description: "Protects body from external environment",
		polishDescription: "Chroni organizm przed środowiskiem zewnętrznym",
		organs: ["Skin", "Hair", "Nails", "Sweat glands", "Sebaceous glands"],
		polishOrgans: [
			"Skóra",
			"Włosy",
			"Paznokcie",
			"Gruczoły potowe",
			"Gruczoły łojowe",
		],
	},
];

// Default view modes for each system
export const DEFAULT_VIEW_MODES: Record<string, ViewMode[]> = {
	skeletal: [
		{
			id: "full-skeleton",
			name: "Full Skeleton",
			polishName: "Pełny szkielet",
			cameraPosition: [0, 0, 5],
			cameraTarget: [0, 0, 0],
			showInternal: false,
			showExternal: true,
			showSkeleton: true,
			showMuscles: false,
			showOrgans: false,
		},
		{
			id: "axial-skeleton",
			name: "Axial Skeleton",
			polishName: "Szkielet osiowy",
			cameraPosition: [0, 1, 3],
			cameraTarget: [0, 0, 0],
			showInternal: false,
			showExternal: true,
			showSkeleton: true,
			showMuscles: false,
			showOrgans: false,
		},
	],
	muscular: [
		{
			id: "superficial-muscles",
			name: "Superficial Muscles",
			polishName: "Mięśnie powierzchowne",
			cameraPosition: [0, 0, 4],
			cameraTarget: [0, 0, 0],
			showInternal: false,
			showExternal: true,
			showSkeleton: false,
			showMuscles: true,
			showOrgans: false,
		},
		{
			id: "deep-muscles",
			name: "Deep Muscles",
			polishName: "Mięśnie głębokie",
			cameraPosition: [0, 0, 4],
			cameraTarget: [0, 0, 0],
			showInternal: true,
			showExternal: false,
			showSkeleton: false,
			showMuscles: true,
			showOrgans: false,
		},
	],
	respiratory: [
		{
			id: "respiratory-overview",
			name: "Respiratory Overview",
			polishName: "Przegląd układu oddechowego",
			cameraPosition: [0, 0, 4],
			cameraTarget: [0, 0, 0],
			showInternal: true,
			showExternal: false,
			showSkeleton: false,
			showMuscles: false,
			showOrgans: true,
		},
		{
			id: "lung-detail",
			name: "Lung Detail",
			polishName: "Szczegóły płuc",
			cameraPosition: [2, 0, 2],
			cameraTarget: [0, 0, 0],
			showInternal: true,
			showExternal: false,
			showSkeleton: false,
			showMuscles: false,
			showOrgans: true,
		},
	],
	nervous: [
		{
			id: "central-nervous",
			name: "Central Nervous System",
			polishName: "Układ nerwowy centralny",
			cameraPosition: [0, 1, 3],
			cameraTarget: [0, 0, 0],
			showInternal: true,
			showExternal: false,
			showSkeleton: false,
			showMuscles: false,
			showOrgans: true,
		},
		{
			id: "peripheral-nervous",
			name: "Peripheral Nervous System",
			polishName: "Układ nerwowy obwodowy",
			cameraPosition: [0, 0, 5],
			cameraTarget: [0, 0, 0],
			showInternal: true,
			showExternal: false,
			showSkeleton: false,
			showMuscles: false,
			showOrgans: true,
		},
	],
	endocrine: [
		{
			id: "endocrine-overview",
			name: "Endocrine Overview",
			polishName: "Przegląd układu hormonalnego",
			cameraPosition: [0, 0, 4],
			cameraTarget: [0, 0, 0],
			showInternal: true,
			showExternal: false,
			showSkeleton: false,
			showMuscles: false,
			showOrgans: true,
		},
	],
	reproductive: [
		{
			id: "male-reproductive",
			name: "Male Reproductive",
			polishName: "Układ rozrodczy męski",
			cameraPosition: [0, -1, 3],
			cameraTarget: [0, 0, 0],
			showInternal: true,
			showExternal: false,
			showSkeleton: false,
			showMuscles: false,
			showOrgans: true,
		},
		{
			id: "female-reproductive",
			name: "Female Reproductive",
			polishName: "Układ rozrodczy żeński",
			cameraPosition: [0, -1, 3],
			cameraTarget: [0, 0, 0],
			showInternal: true,
			showExternal: false,
			showSkeleton: false,
			showMuscles: false,
			showOrgans: true,
		},
	],
	integumentary: [
		{
			id: "skin-overview",
			name: "Skin Overview",
			polishName: "Przegląd skóry",
			cameraPosition: [0, 0, 3],
			cameraTarget: [0, 0, 0],
			showInternal: false,
			showExternal: true,
			showSkeleton: false,
			showMuscles: false,
			showOrgans: true,
		},
		{
			id: "skin-layers",
			name: "Skin Layers",
			polishName: "Warstwy skóry",
			cameraPosition: [0, 0, 2],
			cameraTarget: [0, 0, 0],
			showInternal: true,
			showExternal: false,
			showSkeleton: false,
			showMuscles: false,
			showOrgans: true,
		},
	],
};

// Animation presets for different physiological processes
export const ANIMATION_PRESETS = {
	breathing: {
		name: "Oddychanie",
		polishName: "Breathing",
		duration: 4000,
		easing: "easeInOutSine",
		organs: ["lungs", "diaphragm"],
		description: "Animacja ruchu oddechowego",
	},
	heartbeat: {
		name: "Bicie serca",
		polishName: "Heartbeat",
		duration: 800,
		easing: "easeInOutQuad",
		organs: ["heart"],
		description: "Animacja cyklu serca",
	},
	muscle_contraction: {
		name: "Skurcz mięśni",
		polishName: "Muscle Contraction",
		duration: 2000,
		easing: "easeOutQuart",
		organs: ["skeletal-muscles"],
		description: "Animacja skurczu mięśniowego",
	},
	nerve_impulse: {
		name: "Impuls nerwowy",
		polishName: "Nerve Impulse",
		duration: 1000,
		easing: "linear",
		organs: ["nerves"],
		description: "Animacja przewodzenia impulsów nerwowych",
	},
} as const;
