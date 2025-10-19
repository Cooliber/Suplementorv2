/**
 * =================================================================
 * COMPREHENSIVE DOCUMENTATION SYSTEM TYPES
 *
 * Advanced type definitions for documentation, help systems, guides,
 * FAQs, tutorials, and knowledge base management.
 * =================================================================
 */

export type DocumentationType =
	| "guide"
	| "tutorial"
	| "faq"
	| "reference"
	| "api"
	| "troubleshooting"
	| "best_practices"
	| "changelog";
export type DocumentationStatus =
	| "draft"
	| "review"
	| "published"
	| "archived"
	| "deprecated";
export type ContentFormat =
	| "markdown"
	| "html"
	| "text"
	| "interactive"
	| "video"
	| "mixed";
export type DifficultyLevel =
	| "beginner"
	| "intermediate"
	| "advanced"
	| "expert";
export type UserRole =
	| "guest"
	| "user"
	| "premium"
	| "moderator"
	| "admin"
	| "developer";

// ----------------------------------------------------------------
// 1. CORE DOCUMENTATION ENTITIES
// ----------------------------------------------------------------

export interface DocumentationArticle {
	id: string;
	title: string;
	polishTitle?: string;
	slug: string;
	type: DocumentationType;
	status: DocumentationStatus;
	content: DocumentationContent;
	metadata: DocumentationMetadata;
	seo: SEOData;
	access: AccessControl;
	analytics: DocumentationAnalytics;
	relations: DocumentationRelations;
}

export interface DocumentationContent {
	format: ContentFormat;
	body: string;
	polishBody?: string;
	summary: string;
	polishSummary?: string;
	tableOfContents?: TableOfContentsItem[];
	sections: DocumentationSection[];
	media: DocumentationMedia[];
	codeExamples: CodeExample[];
	interactiveElements: InteractiveElement[];
	estimatedReadTime: number;
	polishEstimatedReadTime?: number;
}

export interface DocumentationSection {
	id: string;
	title: string;
	polishTitle?: string;
	content: string;
	polishContent?: string;
	order: number;
	level: number; // heading level
	media?: DocumentationMedia[];
	codeExamples?: CodeExample[];
	estimatedTime?: number;
}

export interface TableOfContentsItem {
	id: string;
	title: string;
	polishTitle?: string;
	level: number;
	children?: TableOfContentsItem[];
	url?: string;
}

export interface DocumentationMedia {
	id: string;
	type: "image" | "video" | "audio" | "gif" | "infographic";
	url: string;
	alt: string;
	polishAlt?: string;
	caption?: string;
	polishCaption?: string;
	thumbnail?: string;
	dimensions?: { width: number; height: number };
	size?: number; // bytes
	accessibility: MediaAccessibility;
}

export interface MediaAccessibility {
	screenReader: boolean;
	highContrast: boolean;
	reducedMotion: boolean;
	colorBlindFriendly: boolean;
	alternativeFormats: string[];
}

export interface CodeExample {
	id: string;
	title: string;
	polishTitle?: string;
	language: string;
	code: string;
	description?: string;
	polishDescription?: string;
	runnable: boolean;
	editable: boolean;
	tags: string[];
	difficulty: DifficultyLevel;
}

export interface InteractiveElement {
	id: string;
	type: "quiz" | "simulation" | "calculator" | "sandbox" | "demo";
	title: string;
	polishTitle?: string;
	data: Record<string, any>;
	instructions: string;
	polishInstructions?: string;
}

// ----------------------------------------------------------------
// 2. DOCUMENTATION METADATA AND MANAGEMENT
// ----------------------------------------------------------------

export interface DocumentationMetadata {
	version: string;
	createdAt: string;
	updatedAt: string;
	author: string;
	reviewers?: string[];
	editor?: string;
	tags: string[];
	categories: string[];
	difficulty: DifficultyLevel;
	prerequisites?: string[];
	relatedArticles?: string[];
	lastReviewed?: string;
	nextReview?: string;
	quality: DocumentationQuality;
	feedback: DocumentationFeedback[];
}

export interface DocumentationQuality {
	score: number; // 0-100
	accuracy: number;
	completeness: number;
	clarity: number;
	currency: number;
	issues: QualityIssue[];
	lastAssessed: string;
	assessor: string;
}

export interface QualityIssue {
	type:
		| "accuracy"
		| "completeness"
		| "clarity"
		| "outdated"
		| "broken_link"
		| "typo";
	severity: "low" | "medium" | "high" | "critical";
	description: string;
	location?: string;
	reportedBy?: string;
	reportedAt: string;
	status: "open" | "investigating" | "resolved" | "dismissed";
}

export interface DocumentationFeedback {
	id: string;
	userId?: string;
	rating: number; // 1-5
	comment?: string;
	polishComment?: string;
	type: "general" | "accuracy" | "clarity" | "completeness" | "bug_report";
	helpful: number;
	notHelpful: number;
	createdAt: string;
	status: "pending" | "reviewed" | "implemented" | "dismissed";
}

export interface SEOData {
	metaTitle: string;
	polishMetaTitle?: string;
	metaDescription: string;
	polishMetaDescription?: string;
	keywords: string[];
	polishKeywords?: string[];
	canonicalUrl?: string;
	openGraph: OpenGraphData;
	twitterCard: TwitterCardData;
	structuredData?: Record<string, any>;
}

export interface OpenGraphData {
	title: string;
	polishTitle?: string;
	description: string;
	polishDescription?: string;
	image?: string;
	url: string;
	type: "article" | "website" | "tutorial";
	author?: string;
	publishedTime?: string;
	modifiedTime?: string;
}

export interface TwitterCardData {
	card: "summary" | "summary_large_image" | "app" | "player";
	title: string;
	polishTitle?: string;
	description: string;
	polishDescription?: string;
	image?: string;
	site?: string;
	creator?: string;
}

// ----------------------------------------------------------------
// 3. ACCESS CONTROL AND PERSONALIZATION
// ----------------------------------------------------------------

export interface AccessControl {
	visibility: "public" | "authenticated" | "premium" | "role_based" | "private";
	requiredRoles?: UserRole[];
	requiredPermissions?: string[];
	allowedUsers?: string[];
	blockedUsers?: string[];
	geoRestrictions?: string[];
	ageRestrictions?: number;
	prerequisites?: string[];
}

export interface DocumentationAnalytics {
	views: ViewAnalytics;
	engagement: EngagementAnalytics;
	search: SearchAnalytics;
	user: UserAnalytics;
}

export interface ViewAnalytics {
	total: number;
	unique: number;
	trending: boolean;
	viewsByDay: { date: string; count: number }[];
	averageTime: number;
	bounceRate: number;
	exitRate: number;
}

export interface EngagementAnalytics {
	likes: number;
	dislikes: number;
	comments: number;
	shares: number;
	bookmarks: number;
	helpful: number;
	notHelpful: number;
	averageRating: number;
}

export interface SearchAnalytics {
	searchTerms: { term: string; count: number; success: number }[];
	clickThrough: number;
	noResults: number;
	refinements: number;
}

export interface UserAnalytics {
	byRole: Record<UserRole, number>;
	byDevice: Record<string, number>;
	byBrowser: Record<string, number>;
	byCountry: Record<string, number>;
	returningUsers: number;
	newUsers: number;
}

// ----------------------------------------------------------------
// 4. DOCUMENTATION RELATIONS AND NAVIGATION
// ----------------------------------------------------------------

export interface DocumentationRelations {
	parent?: string;
	children: string[];
	siblings: string[];
	related: string[];
	prerequisites: string[];
	followUps: string[];
	alternatives: string[];
	seeAlso: string[];
	externalLinks: ExternalLink[];
}

export interface ExternalLink {
	title: string;
	polishTitle?: string;
	url: string;
	description: string;
	polishDescription?: string;
	type: "official" | "reference" | "tutorial" | "tool" | "community";
	lastChecked: string;
	isActive: boolean;
}

// ----------------------------------------------------------------
// 5. KNOWLEDGE BASE AND CATEGORIZATION
// ----------------------------------------------------------------

export interface DocumentationCategory {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	parent?: string;
	children: string[];
	articles: string[];
	icon?: string;
	color?: string;
	order: number;
	metadata: CategoryMetadata;
}

export interface CategoryMetadata {
	articleCount: number;
	totalViews: number;
	averageRating: number;
	lastUpdated: string;
	maintainer?: string;
	isActive: boolean;
}

export interface DocumentationCollection {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	type: "series" | "course" | "topic" | "product" | "version";
	articles: string[];
	order: string[]; // article IDs in order
	progress: CollectionProgress;
	metadata: CollectionMetadata;
}

export interface CollectionProgress {
	totalArticles: number;
	completedArticles: number;
	inProgressArticles: number;
	averageProgress: number;
	estimatedTime: number;
	userProgress?: UserCollectionProgress;
}

export interface UserCollectionProgress {
	userId: string;
	completed: string[];
	inProgress: string[];
	currentArticle?: string;
	startedAt: string;
	lastActivity: string;
	progress: number;
	notes?: string;
}

export interface CollectionMetadata {
	author: string;
	difficulty: DifficultyLevel;
	estimatedHours: number;
	prerequisites?: string[];
	certificate?: CertificateData;
	isActive: boolean;
}

// ----------------------------------------------------------------
// 6. HELP SYSTEM AND SUPPORT
// ----------------------------------------------------------------

export interface HelpAnalytics {
	totalViews: number;
	totalHelpful: number;
	totalNotHelpful: number;
	averageResolution: number;
	topCategories: string[];
	searchTerms: string[];
	userSatisfaction: number;
	improvementAreas: string[];
	lastUpdated: string;
}

export interface HelpSystem {
	categories: HelpCategory[];
	articles: HelpArticle[];
	search: HelpSearch;
	support: SupportIntegration;
	analytics: HelpAnalytics;
}

export interface HelpCategory {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	icon: string;
	articles: string[];
	order: number;
	parent?: string;
	metadata: HelpCategoryMetadata;
}

export interface HelpCategoryMetadata {
	articleCount: number;
	totalViews: number;
	averageResolution: number;
	commonIssues: string[];
	lastUpdated: string;
}

export interface HelpArticle {
	id: string;
	title: string;
	polishTitle?: string;
	summary: string;
	polishSummary?: string;
	content: string;
	polishContent?: string;
	category: string;
	tags: string[];
	difficulty: DifficultyLevel;
	estimatedTime: number;
	views: number;
	helpful: number;
	notHelpful: number;
	relatedArticles: string[];
	metadata: HelpArticleMetadata;
}

export interface HelpArticleMetadata {
	createdAt: string;
	updatedAt: string;
	author: string;
	reviewer?: string;
	status: DocumentationStatus;
	quality: number;
	lastReviewed?: string;
}

export interface HelpSearch {
	suggestions: SearchSuggestion[];
	popularQueries: PopularQuery[];
	autoComplete: AutoCompleteData;
	filters: SearchFilter[];
}

export interface SearchSuggestion {
	query: string;
	polishQuery?: string;
	category: string;
	count: number;
	lastSearched: string;
}

export interface PopularQuery {
	query: string;
	polishQuery?: string;
	count: number;
	successRate: number;
	averageTime: number;
}

export interface AutoCompleteData {
	terms: string[];
	categories: string[];
	articles: string[];
}

export interface SearchFilter {
	field: "category" | "type" | "difficulty" | "rating" | "date";
	options: FilterOption[];
}

export interface FilterOption {
	value: string;
	label: string;
	polishLabel?: string;
	count: number;
}

// ----------------------------------------------------------------
// 7. SUPPORT INTEGRATION
// ----------------------------------------------------------------

export interface SupportIntegration {
	tickets: SupportTicket[];
	knowledgeBase: KnowledgeBaseIntegration;
	liveChat: LiveChatIntegration;
	feedback: SupportFeedback;
	metrics: SupportMetrics;
}

export interface SupportTicket {
	id: string;
	userId?: string;
	subject: string;
	polishSubject?: string;
	description: string;
	polishDescription?: string;
	category: string;
	priority: "low" | "medium" | "high" | "urgent";
	status: "open" | "in_progress" | "waiting" | "resolved" | "closed";
	assignedTo?: string;
	createdAt: string;
	updatedAt: string;
	resolvedAt?: string;
	tags: string[];
	relatedArticles: string[];
	satisfaction?: number;
	comments: TicketComment[];
}

export interface TicketComment {
	id: string;
	author: string;
	content: string;
	polishContent?: string;
	isInternal: boolean;
	createdAt: string;
	attachments?: string[];
}

export interface KnowledgeBaseIntegration {
	suggestedArticles: string[];
	searchResults: string[];
	confidence: number;
	context: string;
}

export interface LiveChatIntegration {
	isAvailable: boolean;
	agents: ChatAgent[];
	queue: ChatQueue;
	settings: ChatSettings;
}

export interface ChatAgent {
	id: string;
	name: string;
	status: "online" | "busy" | "away" | "offline";
	specialties: string[];
	languages: string[];
	averageResponse: number;
	rating: number;
}

export interface ChatQueue {
	position: number;
	estimatedWait: number;
	queueLength: number;
}

export interface ChatSettings {
	languages: string[];
	autoTranslate: boolean;
	fileUpload: boolean;
	maxFileSize: number;
}

export interface SupportFeedback {
	overall: number;
	helpfulness: number;
	speed: number;
	knowledge: number;
	friendliness: number;
	comments: string[];
	suggestions: string[];
}

export interface SupportMetrics {
	totalTickets: number;
	resolvedTickets: number;
	averageResolution: number;
	satisfactionScore: number;
	firstResponseTime: number;
	commonIssues: CommonIssue[];
}

export interface CommonIssue {
	issue: string;
	polishIssue?: string;
	count: number;
	averageResolution: number;
	relatedArticles: string[];
}

// ----------------------------------------------------------------
// 8. FAQ SYSTEM
// ----------------------------------------------------------------

export interface FAQSystem {
	categories: FAQCategory[];
	questions: FAQQuestion[];
	search: FAQSearch;
	analytics: FAQAnalytics;
	management: FAQManagement;
}

export interface FAQCategory {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	icon: string;
	questions: string[];
	order: number;
	metadata: FAQCategoryMetadata;
}

export interface FAQCategoryMetadata {
	questionCount: number;
	totalViews: number;
	averageRating: number;
	lastUpdated: string;
}

export interface FAQQuestion {
	id: string;
	question: string;
	polishQuestion?: string;
	answer: string;
	polishAnswer?: string;
	category: string;
	tags: string[];
	difficulty: DifficultyLevel;
	views: number;
	helpful: number;
	notHelpful: number;
	relatedQuestions: string[];
	alternatives: string[];
	metadata: FAQQuestionMetadata;
}

export interface FAQQuestionMetadata {
	createdAt: string;
	updatedAt: string;
	author: string;
	reviewer?: string;
	status: DocumentationStatus;
	lastReviewed?: string;
}

export interface FAQSearch {
	suggestions: string[];
	popular: string[];
	recent: string[];
	trending: string[];
}

export interface FAQAnalytics {
	totalQuestions: number;
	totalViews: number;
	averageRating: number;
	topCategories: string[];
	searchTerms: string[];
}

export interface FAQManagement {
	pendingReview: string[];
	flagged: string[];
	suggestions: FAQSuggestion[];
	duplicates: string[];
}

export interface FAQSuggestion {
	id: string;
	question: string;
	polishQuestion?: string;
	suggestedBy?: string;
	reason: string;
	polishReason?: string;
	votes: number;
	status: "pending" | "approved" | "rejected";
	createdAt: string;
}

// ----------------------------------------------------------------
// 9. TUTORIAL AND GUIDE SYSTEM
// ----------------------------------------------------------------

export interface TutorialSystem {
	tutorials: Tutorial[];
	courses: Course[];
	progress: TutorialProgress;
	achievements: TutorialAchievement[];
}

export interface Tutorial {
	id: string;
	title: string;
	polishTitle?: string;
	description: string;
	polishDescription?: string;
	type: "interactive" | "video" | "text" | "mixed";
	difficulty: DifficultyLevel;
	estimatedTime: number;
	steps: TutorialStep[];
	prerequisites: string[];
	completion: TutorialCompletion;
	metadata: TutorialMetadata;
}

export interface TutorialStep {
	id: string;
	title: string;
	polishTitle?: string;
	content: string;
	polishContent?: string;
	media?: DocumentationMedia[];
	codeExamples?: CodeExample[];
	interactive?: InteractiveElement;
	order: number;
	estimatedTime: number;
	isRequired: boolean;
}

export interface TutorialCompletion {
	certificate?: CertificateData;
	badge?: string;
	xpReward?: number;
	achievements?: string[];
	nextSteps?: string[];
}

export interface TutorialMetadata {
	author: string;
	createdAt: string;
	updatedAt: string;
	version: string;
	tags: string[];
	category: string;
	rating: number;
	completedBy: number;
}

export interface Course {
	id: string;
	title: string;
	polishTitle?: string;
	description: string;
	polishDescription?: string;
	instructor: string;
	modules: CourseModule[];
	duration: number; // weeks
	difficulty: DifficultyLevel;
	prerequisites: string[];
	certificate: CertificateData;
	metadata: CourseMetadata;
}

export interface CourseModule {
	id: string;
	title: string;
	polishTitle?: string;
	tutorials: string[];
	order: number;
	estimatedTime: number;
	isLocked: boolean;
}

export interface CourseMetadata {
	enrolled: number;
	completed: number;
	averageRating: number;
	lastUpdated: string;
	isActive: boolean;
}

export interface TutorialProgress {
	userId: string;
	tutorialId: string;
	currentStep: number;
	completedSteps: number[];
	startedAt: string;
	lastActivity: string;
	progress: number;
	completedAt?: string;
	certificateEarned?: boolean;
}

export interface TutorialAchievement {
	id: string;
	name: string;
	polishName?: string;
	description: string;
	polishDescription?: string;
	icon: string;
	unlockedAt: string;
	tutorialId?: string;
	courseId?: string;
}

// ----------------------------------------------------------------
// 10. CERTIFICATE SYSTEM
// ----------------------------------------------------------------

export interface CertificateData {
	id: string;
	title: string;
	polishTitle?: string;
	description: string;
	polishDescription?: string;
	type: "completion" | "excellence" | "mastery" | "specialization";
	issuedTo: string;
	issuedBy: string;
	issuedAt: string;
	expiresAt?: string;
	verificationCode: string;
	metadata: CertificateMetadata;
	visual: CertificateVisual;
}

export interface CertificateMetadata {
	courseId?: string;
	tutorialId?: string;
	score?: number;
	grade?: string;
	duration?: number;
	skills: string[];
	achievements: string[];
}

export interface CertificateVisual {
	template: string;
	colors: Record<string, string>;
	layout: "classic" | "modern" | "minimal";
	showBorder: boolean;
	showWatermark: boolean;
	customElements?: Record<string, any>;
}

// ----------------------------------------------------------------
// 11. TYPE GUARDS AND UTILITIES
// ----------------------------------------------------------------

export interface DocumentationValidation {
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
export type ArticleId = DocumentationArticle["id"];
export type CategoryId = DocumentationCategory["id"];
export type FAQId = FAQQuestion["id"];
export type TutorialId = Tutorial["id"];

// Type guards
export const isDocumentationArticle = (
	obj: any,
): obj is DocumentationArticle => {
	return (
		obj &&
		typeof obj === "object" &&
		"id" in obj &&
		"title" in obj &&
		"content" in obj
	);
};

export const isHelpArticle = (obj: any): obj is HelpArticle => {
	return (
		obj &&
		typeof obj === "object" &&
		"id" in obj &&
		"title" in obj &&
		"category" in obj
	);
};

export const isFAQQuestion = (obj: any): obj is FAQQuestion => {
	return (
		obj &&
		typeof obj === "object" &&
		"id" in obj &&
		"question" in obj &&
		"answer" in obj
	);
};

export const isTutorial = (obj: any): obj is Tutorial => {
	return (
		obj &&
		typeof obj === "object" &&
		"id" in obj &&
		"title" in obj &&
		"steps" in obj
	);
};

export const isValidDocumentationType = (
	type: string,
): type is DocumentationType => {
	return [
		"guide",
		"tutorial",
		"faq",
		"reference",
		"api",
		"troubleshooting",
		"best_practices",
		"changelog",
	].includes(type);
};

export const isValidDifficulty = (
	difficulty: string,
): difficulty is DifficultyLevel => {
	return ["beginner", "intermediate", "advanced", "expert"].includes(
		difficulty,
	);
};
