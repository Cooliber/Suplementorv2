/**
 * =================================================================
 * COMPREHENSIVE CONTENT MANAGEMENT SYSTEM TYPES
 *
 * Advanced type definitions for content management, validation,
 * processing, and quality assurance across all content types.
 * =================================================================
 */

import type { ContentDomain, Language, Region } from "./cultural-localization";
import type { DocumentationStatus, DocumentationType } from "./documentation";
import type { GamificationCategory, RarityLevel } from "./gamification";

// ----------------------------------------------------------------
// 1. CONTENT MANAGEMENT CORE TYPES
// ----------------------------------------------------------------

export interface ContentManagementSystem {
	registry: ContentRegistry;
	workflow: ContentWorkflow;
	quality: ContentQuality;
	analytics: ContentAnalytics;
	integration: ContentIntegration;
}

export interface ContentCategory {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	parentId?: string;
	children?: string[];
	color?: string;
	icon?: string;
	createdAt: string;
	updatedAt: string;
}

export interface ContentTag {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	color?: string;
	usage: number;
	createdAt: string;
	updatedAt: string;
}

export interface RegistryMetadata {
	totalEntries: number;
	totalCategories: number;
	totalTags: number;
	lastUpdated: string;
	version: string;
	health: "healthy" | "warning" | "error";
}

export interface ContentSearch {
	engine: "internal" | "external" | "hybrid";
	indexed: boolean;
	lastIndexed?: string;
	fieldWeights: Record<string, number>;
	synonyms: Record<string, string[]>;
}

export interface ContentQualityScore {
	overall: number;
	accuracy: number;
	clarity: number;
	completeness: number;
	consistency: number;
	cultural: number;
	technical: number;
	accessibility: number;
	lastCalculated: string;
	assessor: string;
}

export interface ContentRegistry {
	entries: ContentEntry[];
	categories: ContentCategory[];
	tags: ContentTag[];
	metadata: RegistryMetadata;
	search: ContentSearch;
}

export interface ContentEntry {
	id: string;
	type: ContentType;
	title: string;
	polishTitle?: string;
	description: string;
	polishDescription?: string;
	status: ContentStatus;
	versions: ContentVersion[];
	currentVersion: string;
	metadata: ContentMetadata;
	relations: ContentRelation[];
	access: ContentAccess;
	quality: ContentQualityScore;
}

export type ContentType =
	| "article"
	| "tutorial"
	| "faq"
	| "guide"
	| "research"
	| "supplement"
	| "mechanism"
	| "interaction"
	| "safety"
	| "clinical"
	| "educational"
	| "gamification"
	| "cultural"
	| "documentation";

export type ContentStatus =
	| "draft"
	| "review"
	| "approved"
	| "published"
	| "archived"
	| "deprecated"
	| "pending_translation"
	| "translation_review"
	| "cultural_review"
	| "technical_review";

export interface ContentVersion {
	id: string;
	version: string;
	createdAt: string;
	createdBy: string;
	changes: string[];
	content: Record<string, any>;
	isCurrent: boolean;
	isStable: boolean;
}

export interface ContentMetadata {
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	updatedBy: string;
	language: Language;
	region?: Region;
	domain: ContentDomain;
	tags: string[];
	categories: string[];
	estimatedReadTime?: number;
	difficulty?: "beginner" | "intermediate" | "advanced" | "expert";
	targetAudience?: string[];
	prerequisites?: string[];
	relatedContent?: string[];
}

export interface ContentRelation {
	type:
		| "parent"
		| "child"
		| "related"
		| "prerequisite"
		| "followup"
		| "alternative"
		| "translation";
	targetId: string;
	strength: number; // 0-1
	description?: string;
}

export interface ContentAccess {
	visibility: "public" | "authenticated" | "premium" | "restricted";
	roles?: string[];
	permissions?: string[];
	geoRestrictions?: Region[];
	ageRestrictions?: number;
	requiresApproval?: boolean;
}

// ----------------------------------------------------------------
// 2. CONTENT WORKFLOW AND PROCESSING
// ----------------------------------------------------------------

export interface ContentWorkflow {
	stages: WorkflowStage[];
	currentStage: string;
	assignments: WorkflowAssignment[];
	approvals: WorkflowApproval[];
	deadlines: WorkflowDeadline[];
}

export interface WorkflowStage {
	id: string;
	name: string;
	polishName?: string;
	order: number;
	type:
		| "creation"
		| "review"
		| "translation"
		| "cultural"
		| "technical"
		| "approval"
		| "publication";
	required: boolean;
	roles: string[];
	estimatedDuration: number;
	instructions?: string;
	polishInstructions?: string;
}

export interface WorkflowAssignment {
	stageId: string;
	userId: string;
	assignedAt: string;
	assignedBy: string;
	deadline?: string;
	status: "pending" | "in_progress" | "completed" | "overdue";
	notes?: string;
}

export interface WorkflowApproval {
	stageId: string;
	userId: string;
	approved: boolean;
	approvedAt?: string;
	comments?: string;
	polishComments?: string;
	conditions?: string[];
}

export interface WorkflowDeadline {
	stageId: string;
	deadline: string;
	notificationSent: boolean;
	overdue: boolean;
	extension?: {
		newDeadline: string;
		reason: string;
		approvedBy: string;
	};
}

export interface ContentProcessing {
	queue: ProcessingQueue;
	pipeline: ProcessingPipeline;
	results: ProcessingResult[];
	metrics: ProcessingMetrics;
}

export interface ProcessingQueue {
	items: QueueItem[];
	processing: boolean;
	current?: string;
	completed: number;
	failed: number;
}

export interface QueueItem {
	id: string;
	contentId: string;
	operation:
		| "create"
		| "update"
		| "translate"
		| "validate"
		| "publish"
		| "archive";
	priority: "low" | "medium" | "high" | "urgent";
	status: "queued" | "processing" | "completed" | "failed" | "cancelled";
	createdAt: string;
	startedAt?: string;
	completedAt?: string;
	error?: string;
}

export interface ProcessingPipeline {
	stages: PipelineStage[];
	current?: string;
	progress: number;
	estimatedTime: number;
}

export interface PipelineStage {
	name: string;
	type:
		| "validation"
		| "translation"
		| "cultural_check"
		| "technical_review"
		| "quality_assurance"
		| "publication";
	status: "pending" | "running" | "completed" | "failed" | "skipped";
	startedAt?: string;
	completedAt?: string;
	duration?: number;
	results?: Record<string, any>;
}

export interface ProcessingResult {
	itemId: string;
	success: boolean;
	output?: Record<string, any>;
	error?: ProcessingError;
	duration: number;
	timestamp: string;
}

export interface ProcessingError {
	code: string;
	message: string;
	polishMessage?: string;
	severity: "low" | "medium" | "high" | "critical";
	stage?: string;
	recoverable: boolean;
	suggestions?: string[];
}

export interface ProcessingMetrics {
	totalProcessed: number;
	successRate: number;
	averageTime: number;
	byType: Record<ContentType, number>;
	byStage: Record<string, number>;
	errors: ProcessingError[];
}

// ----------------------------------------------------------------
// 3. CONTENT QUALITY ASSURANCE
// ----------------------------------------------------------------

export interface ContentQuality {
	standards: QualityStandard[];
	assessment: QualityAssessment;
	metrics: QualityMetrics;
	improvement: QualityImprovement;
}

export interface QualityStandard {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	category:
		| "linguistic"
		| "cultural"
		| "technical"
		| "structural"
		| "accessibility";
	criteria: QualityCriterion[];
	weight: number;
	minimumScore: number;
}

export interface QualityCriterion {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	metric: string;
	weight: number;
	threshold: number;
	validation: (value: any) => boolean;
}

export interface QualityAssessment {
	contentId: string;
	overall: number;
	byCategory: Record<string, number>;
	byCriterion: Record<string, number>;
	issues: QualityIssue[];
	strengths: string[];
	weaknesses: string[];
	recommendations: QualityRecommendation[];
	lastAssessed: string;
	assessor: string;
}

export interface QualityIssue {
	type:
		| "accuracy"
		| "clarity"
		| "completeness"
		| "consistency"
		| "cultural"
		| "technical"
		| "accessibility";
	severity: "low" | "medium" | "high" | "critical";
	location?: string;
	description: string;
	polishDescription?: string;
	suggestion?: string;
	polishSuggestion?: string;
}

export interface QualityRecommendation {
	type: "immediate" | "short_term" | "long_term";
	priority: "low" | "medium" | "high";
	description: string;
	polishDescription?: string;
	estimatedEffort: number;
	impact: "low" | "medium" | "high";
}

export interface QualityMetrics {
	overall: number;
	trends: QualityTrend[];
	byType: Record<ContentType, number>;
	byLanguage: Record<Language, number>;
	byDomain: Record<ContentDomain, number>;
	benchmarks: QualityBenchmark[];
}

export interface QualityTrend {
	period: string;
	score: number;
	change: number;
	factors: string[];
}

export interface QualityBenchmark {
	name: string;
	target: number;
	current: number;
	trend: "improving" | "stable" | "declining";
	lastUpdated: string;
}

export interface QualityImprovement {
	plans: ImprovementPlan[];
	initiatives: ImprovementInitiative[];
	progress: ImprovementProgress;
}

export interface ImprovementPlan {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	targets: ImprovementTarget[];
	timeline: ImprovementTimeline;
	status: "planning" | "active" | "completed" | "cancelled";
}

export interface ImprovementTarget {
	metric: string;
	current: number;
	target: number;
	deadline: string;
	priority: "low" | "medium" | "high";
}

export interface ImprovementTimeline {
	start: string;
	end: string;
	milestones: ImprovementMilestone[];
}

export interface ImprovementMilestone {
	date: string;
	description: string;
	polishDescription?: string;
	completed: boolean;
	completedAt?: string;
}

export interface ImprovementInitiative {
	id: string;
	name: string;
	polishName?: string;
	type: "training" | "process" | "tool" | "standard" | "automation";
	description: string;
	polishDescription?: string;
	impact: "low" | "medium" | "high";
	effort: "low" | "medium" | "high";
	status: "proposed" | "approved" | "active" | "completed" | "cancelled";
}

export interface ImprovementProgress {
	overall: number;
	byInitiative: Record<string, number>;
	achievements: string[];
	challenges: string[];
	nextSteps: string[];
}

// ----------------------------------------------------------------
// 4. CONTENT ANALYTICS AND INSIGHTS
// ----------------------------------------------------------------

export interface ContentAnalytics {
	overview: ContentOverview;
	performance: ContentPerformance;
	engagement: ContentEngagement;
	search: ContentSearchAnalytics;
	user: ContentUserAnalytics;
}

export interface ContentOverview {
	totalContent: number;
	byType: Record<ContentType, number>;
	byStatus: Record<ContentStatus, number>;
	byLanguage: Record<Language, number>;
	byDomain: Record<ContentDomain, number>;
	recentActivity: ContentActivity[];
}

export interface ContentActivity {
	date: string;
	created: number;
	updated: number;
	published: number;
	archived: number;
	views: number;
}

export interface ContentPerformance {
	views: PerformanceMetric;
	engagement: PerformanceMetric;
	conversions: PerformanceMetric;
	quality: PerformanceMetric;
	trends: PerformanceTrend[];
}

export interface PerformanceMetric {
	total: number;
	average: number;
	median: number;
	trend: "up" | "down" | "stable";
	change: number;
}

export interface PerformanceTrend {
	period: string;
	metric: string;
	value: number;
	change: number;
	factors: string[];
}

export interface ContentEngagement {
	likes: number;
	dislikes: number;
	comments: number;
	shares: number;
	bookmarks: number;
	helpful: number;
	notHelpful: number;
	averageRating: number;
	engagementRate: number;
}

export interface ContentSearchAnalytics {
	searchTerms: SearchTermAnalytics[];
	noResults: number;
	refinements: number;
	clickThrough: number;
	averagePosition: number;
}

export interface SearchTermAnalytics {
	term: string;
	polishTerm?: string;
	searches: number;
	clicks: number;
	success: number;
	trend: "up" | "down" | "stable";
}

export interface ContentUserAnalytics {
	byRole: Record<string, number>;
	byLanguage: Record<Language, number>;
	byRegion: Record<Region, number>;
	byDevice: Record<string, number>;
	returningUsers: number;
	newUsers: number;
	averageSession: number;
}

// ----------------------------------------------------------------
// 5. CONTENT VALIDATION AND TYPE GUARDS
// ----------------------------------------------------------------

export interface ContentValidation {
	isValid: boolean;
	errors: ValidationError[];
	warnings: ValidationWarning[];
	suggestions: ValidationSuggestion[];
	metadata: ValidationMetadata;
}

export interface ValidationError {
	field: string;
	message: string;
	polishMessage?: string;
	code: string;
	severity: "error" | "warning" | "info";
	location?: string;
	path?: string;
}

export interface ValidationWarning {
	field: string;
	message: string;
	polishMessage?: string;
	suggestion?: string;
	severity: "low" | "medium" | "high";
}

export interface ValidationSuggestion {
	type: "improvement" | "addition" | "removal" | "restructure";
	field: string;
	message: string;
	polishMessage?: string;
	impact: "low" | "medium" | "high";
	effort: "low" | "medium" | "high";
}

export interface ValidationMetadata {
	validatedAt: string;
	validator: string;
	version: string;
	duration: number;
	standards: string[];
}

// ----------------------------------------------------------------
// 6. CONTENT INTEGRATION AND SYNCHRONIZATION
// ----------------------------------------------------------------

export interface ContentIntegration {
	sources: ContentSource[];
	destinations: ContentDestination[];
	sync: ContentSync;
	apis: ContentAPI[];
	webhooks: ContentWebhook[];
}

export interface ContentSource {
	id: string;
	name: string;
	type: "database" | "api" | "file" | "cms" | "manual";
	connection: ConnectionConfig;
	schema: SourceSchema;
	lastSync?: string;
	status: "active" | "inactive" | "error" | "syncing";
}

export interface ConnectionConfig {
	url?: string;
	credentials?: Record<string, string>;
	options: Record<string, any>;
	timeout: number;
	retries: number;
}

export interface SourceSchema {
	fields: SchemaField[];
	relations: SchemaRelation[];
	validations: SchemaValidation[];
}

export interface SchemaField {
	name: string;
	type: string;
	required: boolean;
	unique: boolean;
	indexed: boolean;
	localization?: boolean;
}

export interface SchemaRelation {
	from: string;
	to: string;
	type: "one_to_one" | "one_to_many" | "many_to_many";
	required: boolean;
}

export interface SchemaValidation {
	field: string;
	rule: string;
	message: string;
	severity: "error" | "warning";
}

export interface ContentDestination {
	id: string;
	name: string;
	type: "database" | "api" | "file" | "cms" | "search_index";
	connection: ConnectionConfig;
	mapping: FieldMapping;
	lastSync?: string;
	status: "active" | "inactive" | "error" | "syncing";
}

export interface FieldMapping {
	sourceField: string;
	destinationField: string;
	transformation?: string;
	defaultValue?: any;
	required: boolean;
}

export interface ContentSync {
	schedules: SyncSchedule[];
	jobs: SyncJob[];
	history: SyncHistory;
	settings: SyncSettings;
}

export interface SyncSchedule {
	id: string;
	name: string;
	sourceId: string;
	destinationId: string;
	frequency: "realtime" | "hourly" | "daily" | "weekly" | "monthly";
	enabled: boolean;
	lastRun?: string;
	nextRun?: string;
}

export interface SyncJob {
	id: string;
	scheduleId: string;
	status: "running" | "completed" | "failed" | "cancelled";
	startedAt: string;
	completedAt?: string;
	duration?: number;
	records: number;
	errors: number;
}

export interface SyncHistory {
	totalRuns: number;
	successRate: number;
	averageDuration: number;
	lastSuccess?: string;
	lastFailure?: string;
	trends: SyncTrend[];
}

export interface SyncTrend {
	date: string;
	success: number;
	failed: number;
	duration: number;
}

export interface SyncSettings {
	conflictResolution: "source_wins" | "destination_wins" | "manual" | "newest";
	errorHandling: "stop" | "continue" | "retry";
	notifications: boolean;
	logLevel: "error" | "warn" | "info" | "debug";
}

export interface ContentAPI {
	id: string;
	name: string;
	baseUrl: string;
	endpoints: APIEndpoint[];
	authentication: APIAuthentication;
	rateLimit: RateLimit;
}

export interface APIEndpoint {
	path: string;
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	description: string;
	parameters: APIParameter[];
	response: APIResponse;
}

export interface APIParameter {
	name: string;
	type: string;
	required: boolean;
	description: string;
	example?: any;
}

export interface APIResponse {
	type: string;
	description: string;
	example?: any;
}

export interface APIAuthentication {
	type: "none" | "basic" | "bearer" | "api_key" | "oauth";
	credentials?: Record<string, string>;
}

export interface RateLimit {
	requests: number;
	period: number;
	strategy: "fixed_window" | "sliding_window";
}

export interface ContentWebhook {
	id: string;
	name: string;
	url: string;
	events: WebhookEvent[];
	secret?: string;
	status: "active" | "inactive" | "error";
	lastTriggered?: string;
}

export interface WebhookEvent {
	type:
		| "content_created"
		| "content_updated"
		| "content_deleted"
		| "content_published";
	filter?: Record<string, any>;
}

// ----------------------------------------------------------------
// 7. TYPE GUARDS AND UTILITIES
// ----------------------------------------------------------------

// Type guards for content management
export const isContentEntry = (obj: any): obj is ContentEntry => {
	return (
		obj &&
		typeof obj === "object" &&
		"id" in obj &&
		"type" in obj &&
		"status" in obj
	);
};

export const isContentRegistry = (obj: any): obj is ContentRegistry => {
	return (
		obj &&
		typeof obj === "object" &&
		"entries" in obj &&
		"categories" in obj &&
		"metadata" in obj
	);
};

export const isQualityAssessment = (obj: any): obj is QualityAssessment => {
	return (
		obj &&
		typeof obj === "object" &&
		"contentId" in obj &&
		"overall" in obj &&
		"issues" in obj
	);
};

export const isContentValidation = (obj: any): obj is ContentValidation => {
	return (
		obj &&
		typeof obj === "object" &&
		"isValid" in obj &&
		"errors" in obj &&
		"warnings" in obj
	);
};

export const isProcessingResult = (obj: any): obj is ProcessingResult => {
	return (
		obj &&
		typeof obj === "object" &&
		"itemId" in obj &&
		"success" in obj &&
		"timestamp" in obj
	);
};

// Utility types for type-safe operations
export type ContentId = ContentEntry["id"];
export type VersionId = ContentVersion["id"];
export type CategoryId = string;
export type TagId = string;

// Content management utilities
export interface ContentFilter {
	type?: ContentType[];
	status?: ContentStatus[];
	language?: Language[];
	domain?: ContentDomain[];
	tags?: string[];
	categories?: string[];
	dateRange?: { start: string; end: string };
	quality?: { min: number; max: number };
}

export interface ContentSort {
	field: string;
	direction: "asc" | "desc";
}

export interface ContentSearchQuery {
	query?: string;
	filters?: ContentFilter;
	sort?: ContentSort;
	limit?: number;
	offset?: number;
}

export interface ContentSearchResult {
	items: ContentEntry[];
	total: number;
	facets: SearchFacet[];
	suggestions?: string[];
	query: ContentSearchQuery;
}

export interface SearchFacet {
	field: string;
	values: { value: string; count: number }[];
}

// Content operation types
export interface ContentOperation {
	type:
		| "create"
		| "update"
		| "delete"
		| "publish"
		| "archive"
		| "translate"
		| "validate";
	contentId: string;
	userId: string;
	timestamp: string;
	data?: Record<string, any>;
	reason?: string;
}

export interface ContentBatchOperation {
	operation: ContentOperation;
	items: string[];
	settings?: Record<string, any>;
}

// Content monitoring and alerting
export interface ContentMonitoring {
	alerts: ContentAlert[];
	metrics: MonitoringMetric[];
	dashboards: MonitoringDashboard[];
}

export interface ContentAlert {
	id: string;
	type: "quality" | "performance" | "error" | "security" | "compliance";
	severity: "low" | "medium" | "high" | "critical";
	title: string;
	message: string;
	polishMessage?: string;
	contentId?: string;
	triggeredAt: string;
	acknowledged: boolean;
	acknowledgedBy?: string;
	acknowledgedAt?: string;
}

export interface MonitoringMetric {
	name: string;
	value: number;
	threshold?: number;
	unit: string;
	timestamp: string;
	trend: "up" | "down" | "stable";
}

export interface MonitoringDashboard {
	id: string;
	name: string;
	polishName?: string;
	widgets: DashboardWidget[];
	layout: DashboardLayout;
}

export interface DashboardWidget {
	id: string;
	type: "chart" | "metric" | "table" | "alert" | "status";
	title: string;
	polishTitle?: string;
	data: Record<string, any>;
	position: { x: number; y: number; width: number; height: number };
}

export interface DashboardLayout {
	columns: number;
	rows: number;
	gap: number;
	responsive: boolean;
}
