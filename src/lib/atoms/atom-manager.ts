import type {
	AtomAnalytics,
	AtomCache,
	AtomCategory,
	AtomConfig,
	AtomConnection,
	AtomExport,
	AtomImport,
	AtomProcessingState,
	AtomSearchQuery,
	AtomSearchResult,
	AtomValidationResult,
	AtomicKnowledgeGraph,
	KnowledgeAtom,
	UserAtomInteraction,
} from "@/types/atomic-content";

// Precision Constants for Scientific Data Management
export const PRECISION_CONSTANTS = {
	// Statistical Requirements
	STATISTICAL: {
		MIN_SAMPLE_SIZE: 30,
		PREFERRED_SAMPLE_SIZE: 100,
		LARGE_SAMPLE_SIZE: 500,
		VERY_LARGE_SAMPLE_SIZE: 1000,
		CONFIDENCE_INTERVAL_DEFAULT: 0.95,
		P_VALUE_SIGNIFICANCE: 0.05,
		P_VALUE_HIGH_SIGNIFICANCE: 0.01,
		P_VALUE_EXTREME_SIGNIFICANCE: 0.001,
		EFFECT_SIZE_SMALL: 0.2,
		EFFECT_SIZE_MEDIUM: 0.5,
		EFFECT_SIZE_LARGE: 0.8,
	},

	// Neuroimaging Requirements
	NEUROIMAGING: {
		MRI_FIELD_STRENGTH: 3.0, // Tesla minimum requirement
		PET_RESOLUTION: "high",
		DWI_DIRECTIONS: 64,
		ECHO_TIME_RESOLUTION: 2.0,
		BOLD_FMRI_TR_MINUTES: 6,
		SCANNING_VOLUME_MM3_MINIMAL: 1200,
	},

	// Biochemical Ranges
	BIOCHEMICAL: {
		SERUM_GABA_RANGE: { MIN: 20, MAX: 90, UNIT: "pmol/L" },
		PLASMA_TYROSINE_RANGE: { MIN: 100, MAX: 300, UNIT: "nM" },
		CORTISOL_AM_RANGE: { MIN: 50, MAX: 350, UNIT: "nmol/L" },
		INFLAMMATORY_MARKERS: {
			IL6_RANGE: { MIN: 0.5, MAX: 20, UNIT: "pg/mL" },
			CRP_RANGE: { MIN: 0.1, MAX: 10, UNIT: "mg/L" },
			TNF_ALPHA_RANGE: { MIN: 5, MAX: 200, UNIT: "pg/mL" },
		},

		// Effect Size Benchmarks
		EFFECT_SIZE: {
			MINIMAL: 0.2,
			SMALL: 0.5,
			MEDIUM: 0.8,
			LARGE: 1.2,
			VERY_LARGE: 2.0,
		},

		// Time Intervals
		TEMPORAL: {
			DRUG_PEAK_TIME_HOURS: 1,
			SLEEP_CYCLE_ANALYSIS_MINUTES: 30,
			LONGITUDINAL_STUDY_MONTHS: 12,
			CHRONOBIOLOGICAL_ADJUSTMENT_WEEKS: 4,
			NEUROPLASTICITY_MONTHS: 6,
		},
	},
};

export class AtomManager {
	private graph: AtomicKnowledgeGraph;
	private cache: Map<string, KnowledgeAtom>;
	private searchIndex: Map<string, Set<string>>;
	private config: AtomConfig;
	private state: AtomProcessingState;
	private validationCache: Map<string, AtomValidationResult>;
	private subscriptions: Set<(update: any) => void>;

	constructor(config: Partial<AtomConfig> = {}) {
		this.config = this.mergeConfigs(config);
		this.graph = {
			atoms: new Map(),
			connections: new Map(),
			categories: new Map(),
			types: new Map(),
			evidenceLevels: new Map(),
			searchIndex: new Map(),
			metadata: {
				version: "1.0.0",
				lastUpdated: new Date(),
				atomCount: 0,
				connectionCount: 0,
				qualityMetrics: {
					averageConfidence: 0,
					highEvidencePercentage: 0,
					outdatedAtomsPercentage: 0,
				},
			},
		};
		this.cache = new Map();
		this.searchIndex = new Map();
		this.state = {
			status: "idle",
			progress: 0,
			processingStats: {
				totalAtoms: 0,
				validatedAtoms: 0,
				highQualityAtoms: 0,
				recentlyUpdated: 0,
				lastValidation: new Date(),
			},
		};
		this.validationCache = new Map();
		this.subscriptions = new Set();

		this.initializeGraph();
	}

	private mergeConfigs(userConfig: Partial<AtomConfig>): AtomConfig {
		// Start with extensive default configuration and merge user preferences
		return {
			versionControl: {
				enabled: true,
				autoUpdate: true,
				frequency: "daily",
				...userConfig.versionControl,
			},
			validation: {
				enabled: true,
				strictMode: false,
				autoValidate: true,
				criteria: {
					minimumEvidence: "MODERATE",
					requireReferences: true,
					maxAgeDays: 1826, // 5 years
					requireMetadata: false,
				},
				...userConfig.validation,
			},
			performance: {
				cacheSize: 1000,
				prefetchEnabled: true,
				lazyLoading: true,
				maxConnections: 10,
				...userConfig.performance,
			},
			security: {
				accessControl: false,
				authentication: true,
				encryption: false,
				auditTrail: false,
				...userConfig.security,
			},
		};
	}

	private async initializeGraph(): Promise<void> {
		this.setState({ status: "loading", currentStep: "Initializing graph" });

		try {
			this.buildSearchIndex();
			this.buildGraphStructure();
			this.validateAllAtoms();

			this.setState({
				status: "completed",
				progress: 100,
				currentStep: "Initialization complete",
				processingStats: {
					totalAtoms: this.graph.atoms.size,
					validatedAtoms: this.validationCache.size,
					highQualityAtoms: 0,
					recentlyUpdated: 0,
					lastValidation: new Date(),
				},
			});

			console.log(
				`Atomic Knowledge Graph initialized with ${this.graph.atoms.size} atoms`,
			);
		} catch (error) {
			console.error("Failed to initialize atomic knowledge graph:", error);
			this.setState({
				status: "error",
				progress: 0,
				error:
					error instanceof Error
						? error.message
						: "Unknown initialization error",
			});
		}
	}

	private validateAllAtoms(): void {
		let validatedCount = 0;
		let errorCount = 0;

		for (const [id, atom] of this.graph.atoms) {
			const result = this.validateAtom(atom);
			this.validationCache.set(id, result);

			if (result.isValid) {
				validatedCount++;
			} else {
				errorCount++;
				console.warn(`Atom ${id} validation issues:`, result.warnings);
			}
		}

		console.log(
			`Validation complete: ${validatedCount} valid, ${errorCount} invalid atoms`,
		);
	}

	private buildSearchIndex(): void {
		this.graph.searchIndex.clear();

		for (const [id, atom] of this.graph.atoms) {
			// Index content text fields
			const contentWords = [
				atom.title.toLowerCase(),
				atom.polishTitle.toLowerCase(),
				atom.content.toLowerCase(),
				atom.polishContent.toLowerCase(),
				...atom.references.map((ref) => ref.toLowerCase()),
				...atom.relatedAtoms,
			].filter((word) => word.length > 2);

			for (const word of contentWords) {
				if (!this.graph.searchIndex.has(word)) {
					this.graph.searchIndex.set(word, new Set());
				}
				this.graph.searchIndex.get(word)?.add(id);
			}
		}

		console.log(
			`Search index built with ${this.graph.searchIndex.size} unique terms`,
		);
	}

	private buildGraphStructure(): void {
		// Build connections and relationships
		for (const [id, atom] of this.graph.atoms) {
			for (const relatedId of atom.relatedAtoms) {
				if (this.graph.atoms.has(relatedId)) {
					// Create bidirectional connections automatically
					this.graph.connections.set(`${id}→${relatedId}`, {
						id: `${id}→${relatedId}`,
						sourceAtomId: id,
						targetAtomId: relatedId,
						relationshipType: "correlates",
						strength: this.calculateConnectionStrength(
							atom,
							this.graph.atoms.get(relatedId)!,
						),
						confidence: 0.8,
					});
				}
			}
		}
	}

	private calculateConnectionStrength(
		atom1: KnowledgeAtom,
		atom2: KnowledgeAtom,
	): number {
		// Calculate connection strength based on evidence levels and content similarity
		const evidenceWeights = {
			STRONG: 0.9,
			MODERATE: 0.6,
			WEAK: 0.3,
			INSUFFICIENT: 0.1,
		};

		const strength1 = evidenceWeights[atom1.evidenceLevel] || 0.3;
		const strength2 = evidenceWeights[atom2.evidenceLevel] || 0.3;

		// Calculate content similarity (simplified)
		const content1 = `${atom1.title} ${atom1.content}`.toLowerCase();
		const content2 = `${atom2.title} ${atom2.content}`.toLowerCase();
		const similarity = this.calculateTextSimilarity(content1, content2);

		return ((strength1 + strength2) / 2) * (0.7 + 0.3 * similarity);
	}

	private calculateTextSimilarity(text1: string, text2: string): number {
		if (text1 === text2) return 1;

		const words1 = text1.split(/\s+/);
		const words2 = text2.split(/\s+/);
		const commonWords = words1.filter((word) => words2.includes(word));

		return (2 * commonWords.length) / (words1.length + words2.length);
	}

	// Public API Methods
	public getAtom(id: string): KnowledgeAtom | undefined {
		return this.graph.atoms.get(id);
	}

	public getAtomsByCategory(category: string): KnowledgeAtom[] {
		return Array.from(this.graph.atoms.values()).filter(
			(atom) => atom.category === category,
		);
	}

	public getAtomsByType(type: string): KnowledgeAtom[] {
		return Array.from(this.graph.atoms.values()).filter(
			(atom) => atom.type === type,
		);
	}

	public getHighEvidenceAtoms(level = "STRONG"): KnowledgeAtom[] {
		return Array.from(this.graph.atoms.values()).filter(
			(atom) => atom.evidenceLevel === level,
		);
	}

	public searchAtoms(query: AtomSearchQuery): AtomSearchResult {
		const startTime = Date.now();
		let filteredAtoms = Array.from(this.graph.atoms.values());

		// Apply search filters
		if (query.query?.trim()) {
			const searchTerm = query.query.toLowerCase();
			const matchedIds = this.graph.searchIndex.get(searchTerm) || new Set();

			filteredAtoms = filteredAtoms.filter((atom) => matchedIds.has(atom.id));
		}

		if (query.categories && query.categories.length > 0) {
			filteredAtoms = filteredAtoms.filter((atom) =>
				query.categories?.includes(atom.category),
			);
		}

		if (query.types && query.types.length > 0) {
			filteredAtoms = filteredAtoms.filter((atom) =>
				query.types?.includes(atom.type),
			);
		}

		if (query.evidenceLevels && query.evidenceLevels.length > 0) {
			const levelsSet = new Set(query.evidenceLevels);
			filteredAtoms = filteredAtoms.filter((atom) =>
				levelsSet.has(atom.evidenceLevel),
			);
		}

		// Sorting
		filteredAtoms.sort((a, b) => {
			// Prioritize recently updated atoms
			const dateA = new Date(a.lastUpdated);
			const dateB = new Date(b.lastUpdated);
			return dateB.getTime() - dateA.getTime();
		});

		const searchTime = Date.now() - startTime;
		const totalCount = this.graph.atoms.size;

		// Build facets
		const facets: {
			categories: Record<string, number>;
			types: Record<string, number>;
			evidenceLevels: Record<string, number>;
			dateRanges: Record<string, number>;
		} = {
			categories: {},
			types: {},
			evidenceLevels: {},
			dateRanges: {},
		};

		for (const atom of this.graph.atoms.values()) {
			facets.categories[atom.category] =
				(facets.categories[atom.category] || 0) + 1;
			facets.types[atom.type] = (facets.types[atom.type] || 0) + 1;
			facets.evidenceLevels[atom.evidenceLevel] =
				(facets.evidenceLevels[atom.evidenceLevel] || 0) + 1;
			facets.dateRanges.all = (facets.dateRanges.all || 0) + 1;
		}

		const result: AtomSearchResult = {
			atoms: filteredAtoms.slice(0, this.config.performance.cacheSize || 1000),
			totalCount: filteredAtoms.length,
			facets,
			pagination: {
				page: 1,
				pageSize: this.config.performance.cacheSize || 1000,
				totalPages: Math.ceil(
					filteredAtoms.length / (this.config.performance.cacheSize || 1000),
				),
				hasNext: false,
				hasPrevious: false,
			},
			searchTime,
		};

		// Generate query analysis
		if (query.query) {
			const terms = query.query
				.toLowerCase()
				.split(/\s+/)
				.filter((term) => term.length > 1);
			result.queryAnalysis = {
				terms,
				filtersUsed: Object.keys(query).filter(
					(key) => !["query", "pagination"].includes(key),
				),
				suggestions: this.generateSearchSuggestions(query),
			};
		}

		return result;
	}

	private generateSearchSuggestions(query: AtomSearchQuery): string[] {
		// Generate search suggestions based on misspelled or partial matches
		const suggestions: string[] = [];

		// Find similar terms in search index
		if (query.query) {
			const searchTerm = query.query.toLowerCase();
			const terms = new Set<string>();

			for (const term of this.graph.searchIndex.keys()) {
				if (this.calculateTextSimilarity(searchTerm, term) > 0.7) {
					terms.add(term);
				}
			}

			suggestions.push(...Array.from(terms).slice(0, 5));
		}

		return suggestions;
	}

	public validateAtom(atom: KnowledgeAtom): AtomValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];
		let qualityScore = 100;

		// Structural validation
		if (!atom.id || atom.id.trim().length === 0) {
			errors.push("Atom ID is required");
		}

		if (!atom.title || atom.title.trim().length < 5) {
			errors.push("Title must be at least 5 characters");
		}

		if (!atom.content || atom.content.trim().length < 10) {
			errors.push("Content must be at least 10 characters");
		}

		// Content validation using precision requirements
		if (atom.metadata?.neuroimagingData) {
			this.validateNeuroimagingData(
				atom.metadata.neuroimagingData,
				errors,
				warnings,
			);
		}

		if (atom.metadata?.biomarkers) {
			this.validateBiomarkers(atom.metadata.biomarkers, errors, warnings);
		}

		// Evidence level validation
		if (atom.evidenceLevel === "STRONG") {
			if (!atom.references || atom.references.length === 0) {
				warnings.push("STRONG evidence level requires at least one reference");
			}
		}

		// Date validation
		const atomDate = new Date(atom.lastUpdated);
		const daysSinceUpdate =
			(Date.now() - atomDate.getTime()) / (1000 * 60 * 60 * 24);

		if (daysSinceUpdate > this.config.validation.criteria.maxAgeDays) {
			warnings.push(
				`Atom data may be outdated (${Math.round(daysSinceUpdate)} days old)`,
			);
		}

		// Calculate quality score
		qualityScore = Math.max(
			0,
			qualityScore - errors.length * 15 - warnings.length * 5,
		);
		if (atom.evidenceLevel === "STRONG") qualityScore += 20;
		if (atom.references && atom.references.length >= 3) qualityScore += 10;

		return {
			atomId: atom.id,
			isValid: errors.length === 0,
			errors,
			warnings,
			qualityScore,
			issues: {
				missingFields: errors.map((err) => err.replace(/^[^:]+: /, "")),
				inconsistentData: [],
				questionableClaims: [],
				outdatedReferences: [],
			},
			recommendedActions:
				errors.length > 0 || warnings.length > 0
					? [
							"Review and fix validation errors",
							"Add scientific references",
							"Update with recent research",
						]
					: [],
		};
	}

	private validateNeuroimagingData(
		data: any,
		errors: string[],
		warnings: string[],
	): void {
		if (data.sampleSize < PRECISION_CONSTANTS.STATISTICAL.MIN_SAMPLE_SIZE) {
			warnings.push(
				`Small study size (${data.sampleSize}) may limit statistical power`,
			);
		}

		if (data.pValue && data.pValue > 0.05) {
			warnings.push("Results may not be statistically significant (p > 0.05)");
		}

		if (data.ci95) {
			const range = data.ci95.upper - data.ci95.lower;
			if (range > data.ci95.upper * 0.2) {
				warnings.push("Wide confidence interval indicates high uncertainty");
			}
		}
	}

	private validateBiomarkers(
		biomarkers: any,
		errors: string[],
		warnings: string[],
	): void {
		const hasCsfData = false;
		let hasSerumData = false;
		let hasPlasmaData = false;

		for (const biomarker of biomarkers) {
			switch (biomarker.name.toLowerCase()) {
				case "gaba":
				case "serum_gaba":
					hasSerumData = true;
					if (
						biomarker.value >
						PRECISION_CONSTANTS.BIOCHEMICAL.SERUM_GABA_RANGE.MAX
					) {
						errors.push("Serum GABA value exceeds expected range");
					}
					break;
				case "plasma_gaba":
					hasPlasmaData = true;
					if (
						biomarker.value >
						PRECISION_CONSTANTS.BIOCHEMICAL.PLASMA_TYROSINE_RANGE.MAX
					) {
						errors.push("Plasma tyrosine value exceeds expected range");
					}
					break;
			}
		}

		if (hasCsfData && hasPlasmaData && hasSerumData) {
			// Validate ratio expectations
			// CSF to plasma ratios are typically very low
			// This would be more sophisticated in a real implementation
		}
	}

	public async addAtom(atom: KnowledgeAtom): Promise<AtomValidationResult> {
		const validation = this.validateAtom(atom);

		if (!validation.isValid) {
			throw new Error(`Invalid atom: ${validation.errors.join(", ")}`);
		}

		// Add to graph
		this.graph.atoms.set(atom.id, atom);
		this.cache.set(atom.id, atom);

		// Update search index
		this.indexAtom(atom);

		// Build connections
		this.buildAtomConnections(atom);

		// Record analytics
		this.recordInteraction("create", atom.id);

		// Update state
		this.graph.metadata.atomCount = this.graph.atoms.size;
		this.setState({
			currentStep: "Atom added successfully",
			processingStats: {
				totalAtoms: this.graph.atoms.size,
				validatedAtoms: this.validationCache.size,
				highQualityAtoms: 0,
				recentlyUpdated: 0,
				lastValidation: new Date(),
			},
		});

		return validation;
	}

	private indexAtom(atom: KnowledgeAtom): void {
		const contentWords = [
			atom.title.toLowerCase(),
			atom.polishTitle.toLowerCase(),
			atom.content.toLowerCase(),
			atom.polishContent.toLowerCase(),
			...atom.references.map((ref) => ref.toLowerCase()),
			...atom.relatedAtoms,
		].filter((word) => word.length > 2);

		for (const word of contentWords) {
			if (!this.graph.searchIndex.has(word)) {
				this.graph.searchIndex.set(word, new Set());
			}
			this.graph.searchIndex.get(word)?.add(atom.id);
		}
	}

	private buildAtomConnections(atom: KnowledgeAtom): void {
		for (const relatedId of atom.relatedAtoms) {
			if (this.graph.atoms.has(relatedId)) {
				const relatedAtom = this.graph.atoms.get(relatedId)!;

				// Create bidirectional connection
				const connection: AtomConnection = {
					id: `${atom.id}→${relatedId}`,
					sourceAtomId: atom.id,
					targetAtomId: relatedId,
					relationshipType: "correlates",
					strength: this.calculateConnectionStrength(atom, relatedAtom),
					confidence: 0.8,
				};

				this.graph.connections.set(connection.id, connection);
			}
		}
	}

	public updateAtom(
		id: string,
		updates: Partial<KnowledgeAtom>,
	): Promise<KnowledgeAtom> {
		const existingAtom = this.graph.atoms.get(id);
		if (!existingAtom) {
			throw new Error(`Atom not found: ${id}`);
		}

		const updatedAtom: KnowledgeAtom = {
			...existingAtom,
			...updates,
			lastUpdated:
				new Date().toISOString().split("T")[0] || new Date().toISOString(),
		};
		this.graph.atoms.set(id, updatedAtom);
		this.cache.set(id, updatedAtom);

		// Re-index if content changed
		if (updates.title || updates.content || updates.references) {
			// Clear and rebuild index for this atom
			this.indexAtom(updatedAtom);
		}

		this.recordInteraction("update", id);

		return Promise.resolve(updatedAtom);
	}

	public deleteAtom(id: string): Promise<boolean> {
		if (!this.graph.atoms.has(id)) {
			return Promise.resolve(false);
		}

		this.graph.atoms.delete(id);
		this.cache.delete(id);
		this.graph.searchIndex.delete(id);

		// Remove connections
		for (const [connId, connection] of this.graph.connections.entries()) {
			if (connection.sourceAtomId === id || connection.targetAtomId === id) {
				this.graph.connections.delete(connId);
			}
		}

		this.recordInteraction("delete", id);
		this.graph.metadata.atomCount = this.graph.atoms.size;

		return Promise.resolve(true);
	}

	public subscribe(callback: (update: any) => void): () => void {
		this.subscriptions.add(callback);

		// Return unsubscribe function
		return () => {
			this.subscriptions.delete(callback);
		};
	}

	public recordInteraction(type: string, atomId: string): void {
		// Analytics would be stored in a proper system
		// For now, we just log the interaction
		console.log(`Atom interaction: ${type} for atom ${atomId}`);
	}

	private setState(update: Partial<AtomProcessingState>): void {
		this.state = { ...this.state, ...update };
	}

	// Additional public methods
	public clearCache(): void {
		this.cache.clear();
		this.graph.searchIndex.clear();
		console.log("Atom cache cleared");
	}

	public getRecentlyUpdatedAtoms(days = 30): KnowledgeAtom[] {
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - days);

		return Array.from(this.graph.atoms.values())
			.filter((atom) => new Date(atom.lastUpdated) >= cutoffDate)
			.sort(
				(a, b) =>
					new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
			);
	}

	public getPopularAtoms(count = 10): KnowledgeAtom[] {
		// Sort by some popularity metric (would come from analytics)
		return Array.from(this.graph.atoms.values()).slice(
			0,
			Math.min(count, this.graph.atoms.size),
		);
	}
}

// Singleton instance access
let atomManagerInstance: AtomManager | null = null;

export function getAtomManager(): AtomManager {
	if (!atomManagerInstance) {
		atomManagerInstance = new AtomManager();
	}
	return atomManagerInstance;
}
