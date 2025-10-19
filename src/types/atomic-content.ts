// Atomic Knowledge Content Type Definitions
// Enhanced types for atomic content structure with precise scientific data

export interface KnowledgeAtom {
	id: string;
	type:
		| "concept"
		| "fact"
		| "mechanism"
		| "interaction"
		| "study"
		| "guideline";
	category: string;
	title: string;
	polishTitle: string;
	content: string;
	polishContent: string;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
	lastUpdated: string;
	references: string[];
	relatedAtoms: string[];
	metadata?: {
		studySize?: number;
		confidence?: number;
		effectSize?: number;
		statisticalSignificance?: boolean;
		effectDirection?: "positive" | "negative" | "neutral";
		targetPopulation?: string;
		ageRange?: {
			min: number;
			max: number;
		};
		dosageInformation?: {
			substance: string;
			dose: string;
			duration: string;
			timing: string;
		};
		neuroimagingData?: {
			technique: "PET" | "MRI" | "fMRI" | "EEG" | "MEG" | "DTI";
			sampleSize: number;
			effect: string;
			change: number;
			unit: string;
			pValue?: number;
			ci95?: {
				lower: number;
				upper: number;
			};
		};
		biomarkers?: {
			name: string;
			baseline: number;
			postIntervention: number;
			unit: string;
			significance: string;
		};
		geneticFactors?: {
			genes: string[];
			polymorphisms: string[];
			genotypeSpecificity: boolean;
		};
	};
}

export interface AtomConnection {
	id: string;
	sourceAtomId: string;
	targetAtomId: string;
	relationshipType:
		| "enhances"
		| "inhibits"
		| "prerequisite"
		| "cofactor"
		| "mediates"
		| "requires"
		| "prevents"
		| "correlates"
		| "interacts";
	strength: number;
	confidence: number;
	metadata?: {
		mechanism?: string;
		evidenceCount?: number;
		temporalRelationship?: string;
	};
}

export interface AtomCategory {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	icon?: React.ComponentType<{ className?: string }>;
	color: string;
	bgColor: string;
	subcategories?: string[];
}

export interface AtomType {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	icon?: React.ComponentType<{ className?: string }>;
}

export interface EvidenceLevel {
	level: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
	description: string;
	polishDescription: string;
	color: string;
	bgColor: string;
	weight: number;
	requirements?: string[];
}

// Advanced Search and Filtering
export interface AtomSearchQuery {
	query?: string;
	categories?: string[];
	types?: string[];
	evidenceLevels?: EvidenceLevel["level"][];
	dateRange?: {
		start?: Date;
		end?: Date;
	};
	studySize?: {
		min?: number;
		max?: number;
	};
	confidence?: {
		min?: number;
		max?: number;
	};
	hasBiomarkers?: boolean;
	hasNeuroimaging?: boolean;
	hasGeneticFactors?: boolean;
	dosageRange?: {
		min?: number;
		max?: number;
		substance?: string;
	};
}

export interface AtomSearchResult {
	atoms: KnowledgeAtom[];
	totalCount: number;
	facets: {
		categories: Record<string, number>;
		types: Record<string, number>;
		evidenceLevels: Record<EvidenceLevel["level"], number>;
		dateRanges: Record<string, number>;
	};
	pagination: {
		page: number;
		pageSize: number;
		totalPages: number;
		hasNext: boolean;
		hasPrevious: boolean;
	};
	searchTime: number;
	queryAnalysis?: {
		terms: string[];
		filtersUsed: string[];
		suggestions?: string[];
	};
}

// Atomic Content Processing
export interface AtomProcessingState {
	status: "idle" | "loading" | "processing" | "completed" | "error";
	currentStep?: string;
	progress: number;
	error?: string;
	lastProcessed?: Date;
	processingStats: {
		totalAtoms: number;
		validatedAtoms: number;
		highQualityAtoms: number;
		recentlyUpdated: number;
		lastValidation?: Date;
	};
}

export interface AtomValidationResult {
	atomId: string;
	isValid: boolean;
	errors: string[];
	warnings: string[];
	qualityScore: number;
	issues: {
		missingFields: string[];
		inconsistentData: string[];
		questionableClaims: string[];
		outdatedReferences: string[];
	};
	recommendedActions?: string[];
}

export interface AtomVisualization {
	type: "graph" | "timeline" | "network" | "hierarchy" | "matrix";
	layout: {
		algorithm?: string;
		NodeSize?: "uniform" | "weight" | "evidence" | "recent";
		NodeColor?: "category" | "type" | "evidence" | "age";
		EdgeStyle?: "solid" | "curved" | "dashed" | "animated";
	};
	filters: Record<string, boolean | string>;
	options?: {
		showLabels?: boolean;
		showReferences?: boolean;
		showRelated?: boolean;
		maxDepth?: number;
		animation?: boolean;
	};
}

// Real-time Updates
export interface AtomUpdate {
	id: string;
	timestamp: string;
	type: "create" | "update" | "delete" | "reclassify" | "validate";
	changes: Partial<KnowledgeAtom>;
	metadata?: {
		source?: string;
		reviewer?: string;
		confidence?: number;
	};
	impact?: {
		relatedAtomsUpdated: string[];
		categoriesAffected: string[];
		searchIndexNeedsUpdate: boolean;
	};
}

export interface AtomSubscription {
	atomId: string;
	filters?: AtomSearchQuery;
	events: (data: AtomUpdate | AtomValidationResult) => void;
}

// Content Organization
export interface AtomMolecule {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	atoms: string[];
	structure: "linear" | "hierarchical" | "network" | "timeline";
	metadata?: {
		difficulty: "beginner" | "intermediate" | "expert";
		estimatedReadTime: number;
		prerequisites?: string[];
		learningObjectives: string[];
	};
}

export interface AtomOrganism {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	molecules: string[];
	metadata?: {
		complexity: number;
		completeness: number;
		lastRevised: Date;
		topics: string[];
		targetAudience: string[];
	};
}

// Knowledge Graph Structure
export interface AtomicKnowledgeGraph {
	atoms: Map<string, KnowledgeAtom>;
	connections: Map<string, AtomConnection>;
	categories: Map<string, AtomCategory>;
	types: Map<string, AtomType>;
	evidenceLevels: Map<EvidenceLevel["level"], EvidenceLevel>;
	searchIndex: Map<string, Set<string>>;
	metadata: {
		version: string;
		lastUpdated: Date;
		atomCount: number;
		connectionCount: number;
		qualityMetrics: {
			averageConfidence: number;
			highEvidencePercentage: number;
			outdatedAtomsPercentage: number;
		};
	};
}

// Performance and Analytics
export interface AtomAnalytics {
	atomId: string;
	metrics: {
		views: number;
		shares: number;
		downloads: number;
		citations: number;
		interactions: {
			clicks: number;
			expands: number;
			highlights: number;
			timeSpent: number;
		};
	};
	trends: {
		dailyViews: Array<{ date: string; views: number }>;
		popularCategories: Array<{ category: string; count: number }>;
		userEngagement: Array<{
			action: string;
			count: number;
			timestamp: string;
		}>;
	};
}

// User Interaction Tracking
export interface UserAtomInteraction {
	userId?: string;
	atomId: string;
	interaction: {
		type:
			| "view"
			| "expand"
			| "share"
			| "cite"
			| "reference"
			| "bookmark"
			| "note";
		timestamp: string;
		duration?: number;
		context?: string;
	};
	session: {
		sessionId: string;
		startTime: string;
		endTime?: string;
		atomSequence: string[];
	};
	preferences?: {
		categories: string[];
		topics: string[];
		difficulty: "beginner" | "intermediate" | "expert";
		language: "en" | "pl";
	};
}

// API and Data Transfer
export interface AtomExport {
	format: "json" | "xml" | "csv" | "rdf";
	atoms?: KnowledgeAtom[];
	includeMetadata?: boolean;
	includeRelationships?: boolean;
	filters?: AtomSearchQuery;
	timestamp: string;
	version: string;
}

export interface AtomImport {
	source: string;
	format: "json" | "xml" | "csv" | "rdf";
	atoms: KnowledgeAtom[];
	validationMode: "strict" | "lenient" | "none";
	duplicateStrategy: "skip" | "merge" | "replace";
	metadata?: {
		importDate: string;
		sourceVersion?: string;
		processedCount: number;
		skippedCount: number;
		errorCount: number;
	};
}

// Error Handling
export interface AtomError {
	type: "VALIDATION" | "PROCESSING" | "STORAGE" | "NETWORK" | "PERMISSION";
	message: string;
	code?: string;
	details?: {
		atomId?: string;
		field?: string;
		value?: any;
		expectedType?: string;
		constraint?: string;
	};
	stack?: string;
	timestamp: string;
}

// Cache and Performance
export interface AtomCache {
	strategy: "memory" | "database" | "hybrid";
	metadata: {
		maxSize: number;
		ttl: number;
		evictionPolicy: "lru" | "fifo" | "priority";
		compressionEnabled: boolean;
	};
	stats: {
		hitRate: number;
		missRate: number;
		totalRequests: number;
		averageResponseTime: number;
	};
}

// Configuration
export interface AtomConfig {
	versionControl: {
		enabled: boolean;
		autoUpdate: boolean;
		frequency: "realtime" | "hourly" | "daily" | "weekly";
	};
	validation: {
		enabled: boolean;
		strictMode: boolean;
		autoValidate: boolean;
		criteria: {
			minimumEvidence: EvidenceLevel["level"];
			requireReferences: boolean;
			maxAgeDays: number;
			requireMetadata: boolean;
		};
	};
	performance: {
		cacheSize: number;
		prefetchEnabled: boolean;
		lazyLoading: boolean;
		maxConnections: number;
	};
	security: {
		accessControl: boolean;
		authentication: boolean;
		encryption: boolean;
		auditTrail: boolean;
	};
}

// Hooks and State Management
export interface AtomStoreState {
	atoms: Map<string, KnowledgeAtom>;
	selectedAtoms: Set<string>;
	searchResults: AtomSearchResult | null;
	filters: AtomSearchQuery;
	loading: boolean;
	error: string | null;
	metadata: {
		lastUpdated: Date;
		cacheStats: any;
	};
}

export interface AtomActions {
	addAtom: (atom: KnowledgeAtom) => void;
	updateAtom: (id: string, updates: Partial<KnowledgeAtom>) => void;
	deleteAtom: (id: string) => void;
	selectAtom: (id: string) => void;
	searchAtoms: (query: AtomSearchQuery) => AtomSearchResult;
	validateAtom: (atom: KnowledgeAtom) => AtomValidationResult;
	exportAtoms: (options: AtomExport) => void;
	importAtoms: (data: AtomImport) => void;
	clearCache: () => void;
	updateAllAtoms: (atoms: KnowledgeAtom[]) => void;
}

// React Hook Types
export type UseAtomsReturn = {
	atoms: KnowledgeAtom[];
	search: AtomSearchResult | null;
	loading: boolean;
	error: string | null;
	actions: AtomActions;
	filters: AtomSearchQuery;
	updateFilters: (filters: Partial<AtomSearchQuery>) => void;
	clearFilters: () => void;
	atomCacheStats: any;
};

export type UseAtomReturn = {
	atom: KnowledgeAtom | undefined;
	related: KnowledgeAtom[];
	validated?: AtomValidationResult;
	loading: boolean;
	error: string | null;
	updateAtom: (updates: Partial<KnowledgeAtom>) => void;
	validate: () => AtomValidationResult | undefined;
	bookmark: () => void;
	share: () => void;
	cite: () => string;
};

export type UseAtomSearchReturn = {
	results: AtomSearchResult | null;
	loading: boolean;
	error: string | null;
	query: string;
	setQuery: (query: string) => void;
	filters: AtomSearchQuery;
	updateFilters: (filters: Partial<AtomSearchQuery>) => void;
	suggestions: string[];
	clearSearch: () => void;
	performSearch: () => void;
};

// Component Props
export interface KnowledgeAtomProps {
	atom: KnowledgeAtom;
	depth?: number;
	maxDepth?: number;
	showRelated?: boolean;
	showReferences?: boolean;
	language?: "en" | "pl";
	onAtomClick?: (atom: KnowledgeAtom) => void;
	onReferenceClick?: (reference: string) => void;
	compact?: boolean;
}

export interface AtomicPanelProps {
	initialCategory?: string;
	initialType?: string;
	onAtomSelect?: (atom: KnowledgeAtom) => void;
	onReferenceClick?: (reference: string) => void;
	maxAtoms?: number;
	language?: "en" | "pl";
	className?: string;
}

// Validation Schemas
export const atomValidationSchemas = {
	id: {
		required: true,
		type: "string",
		pattern: "^[a-z0-9-_.]+$", // Only alphanumeric, dashes, underscores
		maxLength: 50,
	},
	type: {
		required: true,
		enum: ["concept", "fact", "mechanism", "interaction", "study", "guideline"],
	},
	title: {
		required: true,
		type: "string",
		minLength: 5,
		maxLength: 200,
	},
	content: {
		required: true,
		type: "string",
		minLength: 10,
		maxLength: 2000,
	},
	evidenceLevel: {
		required: true,
		enum: ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT"],
	},
	references: {
		type: "array",
		items: {
			type: "string",
			pattern: "^.*\\s\\d{4}.*$", // Basic validation for publication references
		},
		minItems: 0,
		maxItems: 50,
	},
	lastUpdated: {
		required: true,
		type: "string",
		pattern: "^\\d{4}-\\d{2}-\\d{2}$", // YYYY-MM-DD
	},
};

export type UnitSystem = "imperial" | "metric" | "si";

export const precisionRequirements = {
	numericalData: {
		significantFigures: 2,
		precision: 90,
		supportedUnits: ["imperial", "metric", "si"] as UnitSystem[],
	},
	statisticalData: {
		sampleSize: {
			minimum: 30,
			preferred: 100,
			veryLarge: 1000,
		},
		confidenceInterval: {
			level: [0.9, 0.95, 0.99] as const,
			required: true,
		},
		pValue: {
			significance: 0.05,
			highSignificance: 0.01,
			extremeSignificance: 0.001,
		},
	},
	neuroimaging: {
		resolution: "high" as const,
		fieldStrength: { minimum: 1.5, preferred: 3.0 },
		sequences: ["T1", "T2", "EPI", "FLAIR", "REST", "DWI", "fMRI"] as const,
	},
	biochemical: {
		concentrations: {
			plasma: { unit: "nmol/L", range: "1-1000" },
			serum: { unit: "pmol/L", range: "0.1-1000" },
			csf: { unit: "pmol/L", range: "10-1000" },
		},
		molecularWeight: { range: "50-1000 daltons" },
	},
};
