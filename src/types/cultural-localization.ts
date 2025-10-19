/**
 * =================================================================
 * COMPREHENSIVE CULTURAL AND LOCALIZATION SYSTEM TYPES
 *
 * Advanced type definitions for cultural adaptation, localization,
 * internationalization, and culturally-aware content management.
 * =================================================================
 */

export type Language =
	| "pl"
	| "en"
	| "de"
	| "fr"
	| "es"
	| "it"
	| "ru"
	| "zh"
	| "ja"
	| "ko";
export type Region =
	| "PL"
	| "US"
	| "GB"
	| "DE"
	| "FR"
	| "ES"
	| "IT"
	| "RU"
	| "CN"
	| "JP"
	| "KR"
	| "EU";
export type CulturalContext =
	| "formal"
	| "informal"
	| "academic"
	| "medical"
	| "business"
	| "casual"
	| "traditional"
	| "modern";
export type ContentDomain =
	| "medical"
	| "scientific"
	| "educational"
	| "commercial"
	| "social"
	| "technical"
	| "legal"
	| "cultural";

// ----------------------------------------------------------------
// 1. CORE LOCALIZATION ENTITIES
// ----------------------------------------------------------------

export interface LocalizationEntry {
	id: string;
	key: string;
	context: LocalizationContext;
	translations: Record<Language, TranslationValue>;
	metadata: LocalizationMetadata;
	validation: LocalizationValidation;
	usage: LocalizationUsage;
}

export interface TranslationValue {
	text: string;
	alternatives?: string[];
	notes?: string;
	lastValidated?: string;
	validator?: string;
	isMachineTranslated?: boolean;
	confidence?: number;
}

export interface LocalizationContext {
	domain: ContentDomain;
	culturalContext: CulturalContext;
	region?: Region;
	audience?: AudienceProfile;
	formality: "formal" | "informal" | "neutral";
	technicalLevel: "basic" | "intermediate" | "advanced" | "expert";
}

export interface AudienceProfile {
	ageGroup?: "children" | "teenagers" | "adults" | "seniors";
	educationLevel?: "basic" | "intermediate" | "advanced" | "expert";
	profession?: string[];
	culturalBackground?: string[];
	specialNeeds?: string[];
}

export interface LocalizationMetadata {
	version: string;
	createdAt: string;
	updatedAt: string;
	translator?: string;
	reviewer?: string;
	sourceLanguage: Language;
	targetLanguages: Language[];
	priority: "low" | "medium" | "high" | "critical";
	status: "draft" | "review" | "approved" | "published" | "deprecated";
}

export interface LocalizationValidation {
	isValid: boolean;
	issues: ValidationIssue[];
	warnings: ValidationWarning[];
	culturalNotes: CulturalNote[];
	lastValidated: string;
	validator: string;
}

export interface ValidationIssue {
	type:
		| "grammar"
		| "spelling"
		| "cultural"
		| "technical"
		| "consistency"
		| "formatting";
	severity: "low" | "medium" | "high" | "critical";
	description: string;
	location?: string;
	suggestion?: string;
	affects: Language[];
}

export interface ValidationWarning {
	type:
		| "cultural_sensitivity"
		| "regional_variation"
		| "context_dependent"
		| "ambiguous";
	message: string;
	culturalContext?: string;
	suggestion?: string;
}

export interface CulturalNote {
	aspect:
		| "formality"
		| "politeness"
		| "tradition"
		| "values"
		| "communication_style"
		| "social_norms";
	description: string;
	impact: "low" | "medium" | "high";
	recommendation: string;
	examples: string[];
}

export interface UsageContext {
	contextType: "search" | "view" | "edit" | "approval" | "review";
	userRole?: string;
	userRegion?: Region;
	userLanguage?: Language;
	timestamp: string;
	duration?: number;
	success: boolean;
}

export interface LocalizationUsage {
	searchCount: number;
	viewCount: number;
	lastUsed: string;
	contexts: UsageContext[];
	popularity: number;
}

// ----------------------------------------------------------------
// 2. CULTURAL ADAPTATION SYSTEM
// ----------------------------------------------------------------

export interface CulturalProfile {
	region: Region;
	language: Language;
	culturalDimensions: CulturalDimensions;
	communicationStyle: CommunicationStyle;
	values: CulturalValues;
	preferences: CulturalPreferences;
	restrictions: CulturalRestrictions;
}

export interface CulturalDimensions {
	powerDistance: number; // 1-100
	individualism: number; // 1-100
	masculinity: number; // 1-100
	uncertaintyAvoidance: number; // 1-100
	longTermOrientation: number; // 1-100
	indulgence: number; // 1-100
}

export interface CommunicationStyle {
	directness: "direct" | "indirect";
	formality: "formal" | "informal" | "contextual";
	contextLevel: "high" | "low";
	preferredChannels: string[];
	nonVerbalImportance: number;
}

export interface CulturalValues {
	core: string[];
	traditional: string[];
	modern: string[];
	healthRelated: string[];
	educationRelated: string[];
	social: string[];
}

export interface CulturalPreferences {
	dateFormat: string;
	timeFormat: string;
	numberFormat: string;
	currencyFormat: string;
	addressFormat: string;
	nameFormat: string;
	colorPreferences: string[];
	symbolPreferences: string[];
}

export interface CulturalRestrictions {
	sensitiveTopics: string[];
	tabooSubjects: string[];
	legalRestrictions: string[];
	religiousConsiderations: string[];
	politicalConsiderations: string[];
	ageRestrictions: Record<string, number>;
}

// ----------------------------------------------------------------
// 3. CONTENT LOCALIZATION MANAGEMENT
// ----------------------------------------------------------------

export interface LocalizedContent {
	id: string;
	originalId: string;
	language: Language;
	region?: Region;
	content: LocalizedContentData;
	cultural: CulturalAdaptation;
	technical: TechnicalAdaptation;
	quality: ContentQuality;
	approval: ApprovalWorkflow;
}

export interface LocalizedContentData {
	title: string;
	summary?: string;
	body: string;
	media?: LocalizedMedia[];
	examples?: LocalizedExample[];
	references?: LocalizedReference[];
}

export interface LocalizedMedia {
	type: "image" | "video" | "audio" | "infographic";
	originalUrl: string;
	localizedUrl: string;
	caption: string;
	culturalNotes?: string;
	accessibility: LocalizedAccessibility;
}

export interface LocalizedExample {
	original: string;
	localized: string;
	explanation: string;
	culturalContext?: string;
	relevance: number;
}

export interface LocalizedReference {
	original: string;
	localized: string;
	type: "book" | "article" | "website" | "study";
	availability: "available" | "adapted" | "unavailable";
	notes?: string;
}

export interface LocalizedAccessibility {
	screenReader: boolean;
	highContrast: boolean;
	largeText: boolean;
	colorBlindFriendly: boolean;
	culturalAccessibility: string[];
}

export interface CulturalAdaptation {
	culturalReview: CulturalReview;
	localExamples: boolean;
	localReferences: boolean;
	culturalSensitivity: number;
	adaptationLevel: "none" | "minimal" | "moderate" | "extensive" | "complete";
}

export interface CulturalReview {
	reviewer: string;
	date: string;
	issues: CulturalIssue[];
	approved: boolean;
	conditions?: string[];
}

export interface CulturalIssue {
	type:
		| "terminology"
		| "examples"
		| "references"
		| "values"
		| "communication"
		| "visuals";
	description: string;
	severity: "low" | "medium" | "high";
	resolution: string;
}

export interface TechnicalAdaptation {
	technicalReview: TechnicalReview;
	localStandards: boolean;
	localRegulations: boolean;
	technicalAccuracy: number;
}

export interface TechnicalReview {
	reviewer: string;
	date: string;
	domain: ContentDomain;
	issues: TechnicalIssue[];
	approved: boolean;
}

export interface TechnicalIssue {
	type: "terminology" | "standards" | "regulations" | "safety" | "efficacy";
	description: string;
	severity: "low" | "medium" | "high";
	resolution: string;
}

export interface ContentQuality {
	score: number;
	linguistic: number;
	cultural: number;
	technical: number;
	overall: number;
	lastAssessed: string;
	assessor: string;
}

export interface ApprovalWorkflow {
	steps: WorkflowStep[];
	currentStep: number;
	approved: boolean;
	approvedAt?: string;
	approvedBy?: string;
}

export interface WorkflowStep {
	name: string;
	role: string;
	status: "pending" | "in_progress" | "completed" | "rejected";
	assignee?: string;
	completedAt?: string;
	comments?: string;
}

// ----------------------------------------------------------------
// 4. REGIONAL AND CULTURAL VARIATIONS
// ----------------------------------------------------------------

export interface RegionalVariation {
	region: Region;
	variations: VariationRule[];
	preferences: RegionalPreference[];
	overrides: RegionalOverride[];
}

export interface VariationRule {
	field: string;
	condition: string;
	value: string;
	priority: number;
	description: string;
}

export interface RegionalPreference {
	category: string;
	preference: string;
	strength: number;
	description: string;
}

export interface RegionalOverride {
	field: string;
	original: string;
	override: string;
	reason: string;
	approvedBy: string;
	approvedAt: string;
}

export interface CulturalCalendar {
	region: Region;
	events: CulturalEvent[];
	holidays: CulturalHoliday[];
	observances: CulturalObservance[];
}

export interface CulturalEvent {
	name: string;
	polishName?: string;
	date: string;
	type: "festival" | "religious" | "national" | "seasonal" | "agricultural";
	importance: "low" | "medium" | "high";
	description: string;
	polishDescription?: string;
	traditions: string[];
	modernAdaptations: string[];
}

export interface CulturalHoliday {
	name: string;
	polishName?: string;
	date: string;
	type: "national" | "religious" | "cultural" | "seasonal";
	celebration: string;
	polishCelebration?: string;
	foods: string[];
	activities: string[];
}

export interface CulturalObservance {
	name: string;
	polishName?: string;
	period: { start: string; end: string };
	type: "season" | "fasting" | "celebration" | "remembrance";
	description: string;
	polishDescription?: string;
	guidelines: string[];
}

// ----------------------------------------------------------------
// 5. MEDICAL AND SCIENTIFIC LOCALIZATION
// ----------------------------------------------------------------

export interface MedicalLocalization {
	terminology: MedicalTerminology;
	standards: MedicalStandards;
	regulations: MedicalRegulations;
	cultural: MedicalCultural;
}

export interface MedicalTerminology {
	common: Record<string, Record<Language, string>>;
	specialized: Record<string, Record<Language, string>>;
	abbreviations: Record<string, Record<Language, string>>;
	validation: TerminologyValidation;
}

export interface TerminologyValidation {
	approved: boolean;
	lastValidated: string;
	validator: string;
	issues: TerminologyIssue[];
}

export interface TerminologyIssue {
	term: string;
	language: Language;
	issue: string;
	suggestion: string;
	severity: "low" | "medium" | "high";
}

export interface MedicalStandards {
	region: Region;
	standards: MedicalStandard[];
	compliance: ComplianceStatus;
}

export interface MedicalStandard {
	name: string;
	authority: string;
	version: string;
	description: string;
	requirements: string[];
	lastUpdated: string;
}

export interface ComplianceStatus {
	isCompliant: boolean;
	certifications: string[];
	expiryDates: Record<string, string>;
	audits: AuditRecord[];
}

export interface AuditRecord {
	date: string;
	auditor: string;
	result: "pass" | "fail" | "conditional";
	issues: string[];
	actions: string[];
}

export interface MedicalRegulations {
	region: Region;
	regulations: MedicalRegulation[];
	updates: RegulationUpdate[];
}

export interface MedicalRegulation {
	id: string;
	name: string;
	authority: string;
	description: string;
	effectiveDate: string;
	category: "safety" | "efficacy" | "labeling" | "advertising" | "practice";
	status: "active" | "pending" | "superseded";
}

export interface RegulationUpdate {
	regulationId: string;
	date: string;
	changes: string;
	impact: "low" | "medium" | "high";
	actionRequired: boolean;
	deadline?: string;
}

export interface MedicalCultural {
	sensitivities: MedicalSensitivity[];
	preferences: MedicalPreference[];
	traditions: MedicalTradition[];
}

export interface MedicalSensitivity {
	topic: string;
	sensitivity: "low" | "medium" | "high";
	culturalContext: string;
	handling: string;
}

export interface MedicalPreference {
	aspect: string;
	preference: string;
	strength: number;
	evidence: string;
}

export interface MedicalTradition {
	name: string;
	region: Region;
	description: string;
	integration: "complementary" | "alternative" | "integrated" | "conflicting";
	evidence: string;
}

// ----------------------------------------------------------------
// 6. EDUCATIONAL AND SCIENTIFIC LOCALIZATION
// ----------------------------------------------------------------

export interface ScientificLocalization {
	disciplines: ScientificDiscipline[];
	terminology: ScientificTerminology;
	methodology: ScientificMethodology;
	education: ScientificEducation;
}

export interface ScientificDiscipline {
	name: string;
	field: string;
	subfields: string[];
	terminology: Record<Language, Record<string, string>>;
	standards: ScientificStandard[];
}

export interface ScientificStandard {
	name: string;
	authority: string;
	description: string;
	adoption: Record<Region, boolean>;
}

export interface ScientificTerminology {
	terms: Record<string, ScientificTerm>;
	categories: Record<string, string[]>;
	validation: ScientificValidation;
}

export interface ScientificTerm {
	term: string;
	definition: Record<Language, string>;
	category: string;
	complexity: "basic" | "intermediate" | "advanced";
	relatedTerms: string[];
}

export interface ScientificValidation {
	lastValidated: string;
	validator: string;
	accuracy: number;
	completeness: number;
	issues: ScientificIssue[];
}

export interface ScientificIssue {
	term: string;
	issue: string;
	suggestion: string;
	severity: "low" | "medium" | "high";
}

export interface ScientificMethodology {
	methods: ScientificMethod[];
	standards: MethodologyStandard[];
	validation: MethodologyValidation;
}

export interface ScientificMethod {
	name: string;
	description: Record<Language, string>;
	steps: MethodStep[];
	evidence: string;
}

export interface MethodStep {
	order: number;
	description: Record<Language, string>;
	technical: string;
	cultural: string;
}

export interface MethodologyStandard {
	name: string;
	authority: string;
	description: string;
	compliance: Record<Region, boolean>;
}

export interface MethodologyValidation {
	standard: string;
	lastValidated: string;
	result: "valid" | "invalid" | "partial";
	issues: string[];
}

export interface ScientificEducation {
	levels: EducationLevel[];
	approaches: TeachingApproach[];
	assessment: AssessmentMethod[];
}

export interface EducationLevel {
	level: string;
	description: Record<Language, string>;
	competencies: string[];
	methods: string[];
}

export interface TeachingApproach {
	name: string;
	description: Record<Language, string>;
	cultural: string;
	effectiveness: number;
}

export interface AssessmentMethod {
	name: string;
	description: Record<Language, string>;
	cultural: string;
	validity: number;
}

// ----------------------------------------------------------------
// 7. LOCALIZATION ANALYTICS AND INSIGHTS
// ----------------------------------------------------------------

export interface LocalizationAnalytics {
	overall: LocalizationOverview;
	byLanguage: Record<Language, LanguageAnalytics>;
	byRegion: Record<Region, RegionAnalytics>;
	byDomain: Record<ContentDomain, DomainAnalytics>;
	insights: LocalizationInsight[];
}

export interface LocalizationOverview {
	totalEntries: number;
	translatedEntries: number;
	completionRate: number;
	qualityScore: number;
	lastUpdated: string;
}

export interface LanguageAnalytics {
	completion: number;
	quality: number;
	usage: number;
	issues: number;
	trends: TrendData[];
}

export interface RegionAnalytics {
	preferences: RegionalPreference[];
	usage: number;
	satisfaction: number;
	adaptations: number;
}

export interface DomainAnalytics {
	completion: number;
	quality: number;
	specificity: number;
	complexity: number;
}

export interface TrendData {
	date: string;
	metric: string;
	value: number;
	change: number;
}

export interface LocalizationInsight {
	type: "trend" | "issue" | "opportunity" | "recommendation";
	title: string;
	description: string;
	impact: "low" | "medium" | "high";
	actionable: boolean;
	priority: number;
	data: Record<string, any>;
}

// ----------------------------------------------------------------
// 8. QUALITY ASSURANCE AND VALIDATION
// ----------------------------------------------------------------

export interface QualityAssurance {
	standards: QualityStandard[];
	processes: QualityProcess[];
	metrics: QualityMetrics;
	audits: QualityAudit[];
}

export interface QualityStandard {
	name: string;
	description: string;
	criteria: QualityCriterion[];
	weight: number;
	threshold: number;
}

export interface QualityCriterion {
	name: string;
	description: string;
	metric: string;
	weight: number;
	threshold: number;
}

export interface QualityProcess {
	name: string;
	steps: ProcessStep[];
	roles: string[];
	duration: number;
}

export interface ProcessStep {
	name: string;
	description: string;
	role: string;
	duration: number;
	inputs: string[];
	outputs: string[];
}

export interface QualityMetrics {
	overall: number;
	linguistic: number;
	cultural: number;
	technical: number;
	consistency: number;
}

export interface QualityAudit {
	id: string;
	date: string;
	auditor: string;
	scope: string;
	results: AuditResult;
	actions: AuditAction[];
}

export interface AuditResult {
	score: number;
	issues: AuditIssue[];
	strengths: string[];
	weaknesses: string[];
}

export interface AuditIssue {
	type: string;
	severity: "low" | "medium" | "high";
	description: string;
	location: string;
	recommendation: string;
}

export interface AuditAction {
	issue: string;
	action: string;
	owner: string;
	deadline: string;
	status: "pending" | "in_progress" | "completed";
}

// ----------------------------------------------------------------
// 9. TYPE GUARDS AND UTILITIES
// ----------------------------------------------------------------

export interface LocalizationValidation {
	isValid: boolean;
	errors: ValidationError[];
	warnings: ValidationWarning[];
	suggestions: ValidationSuggestion[];
}

export interface ValidationError {
	field: string;
	message: string;
	polishMessage?: string;
	code: string;
	severity: "error" | "warning" | "info";
	location?: string;
}

export interface ValidationWarning {
	field: string;
	message: string;
	polishMessage?: string;
	suggestion?: string;
}

export interface ValidationSuggestion {
	type: "improvement" | "addition" | "removal" | "restructure";
	message: string;
	polishMessage?: string;
	impact: "low" | "medium" | "high";
	effort: "low" | "medium" | "high";
}

// Utility types for type-safe operations
export type LocalizationKey = LocalizationEntry["key"];
export type LanguageKey = Language;
export type RegionKey = Region;
export type DomainKey = ContentDomain;

// Type guards
export const isLocalizationEntry = (obj: any): obj is LocalizationEntry => {
	return (
		obj &&
		typeof obj === "object" &&
		"id" in obj &&
		"key" in obj &&
		"translations" in obj
	);
};

export const isCulturalProfile = (obj: any): obj is CulturalProfile => {
	return (
		obj &&
		typeof obj === "object" &&
		"region" in obj &&
		"language" in obj &&
		"culturalDimensions" in obj
	);
};

export const isLocalizedContent = (obj: any): obj is LocalizedContent => {
	return (
		obj &&
		typeof obj === "object" &&
		"id" in obj &&
		"originalId" in obj &&
		"language" in obj
	);
};

export const isValidLanguage = (lang: string): lang is Language => {
	return ["pl", "en", "de", "fr", "es", "it", "ru", "zh", "ja", "ko"].includes(
		lang,
	);
};

export const isValidRegion = (region: string): region is Region => {
	return [
		"PL",
		"US",
		"GB",
		"DE",
		"FR",
		"ES",
		"IT",
		"RU",
		"CN",
		"JP",
		"KR",
		"EU",
	].includes(region);
};

export const isValidCulturalContext = (
	context: string,
): context is CulturalContext => {
	return [
		"formal",
		"informal",
		"academic",
		"medical",
		"business",
		"casual",
		"traditional",
		"modern",
	].includes(context);
};

export const isValidContentDomain = (
	domain: string,
): domain is ContentDomain => {
	return [
		"medical",
		"scientific",
		"educational",
		"commercial",
		"social",
		"technical",
		"legal",
		"cultural",
	].includes(domain);
};
