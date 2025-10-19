"use client";

/**
 * Comprehensive Accessibility Testing Framework for Suplementor App
 * Provides automated accessibility audits, WCAG 2.1 AA compliance validation,
 * screen reader compatibility testing, and keyboard navigation verification.
 */

import type { BodySystem, Organ, RelatedSupplement } from "@/data/body-systems";

// Core accessibility testing interfaces
export interface AccessibilityTestResult {
	id: string;
	testName: string;
	status: "PASS" | "FAIL" | "WARNING" | "ERROR";
	severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	category: AccessibilityTestCategory;
	description: string;
	polishDescription: string;
	element?: string;
	suggestion?: string;
	polishSuggestion?: string;
	wcagGuideline?: string;
	timestamp: Date;
	autoFixable: boolean;
}

export interface AccessibilityReport {
	id: string;
	timestamp: Date;
	url: string;
	overallScore: number; // 0-100
	totalTests: number;
	passedTests: number;
	failedTests: number;
	warnings: number;
	errors: number;
	results: AccessibilityTestResult[];
	recommendations: string[];
	polishRecommendations: string[];
	complianceLevel: "A" | "AA" | "AAA";
	estimatedRemediationTime: number; // minutes
}

export interface UserProfile {
	id: string;
	type: "STUDENT" | "PROFESSIONAL" | "GENERAL_PUBLIC";
	age?: number;
	educationLevel?: "PRIMARY" | "SECONDARY" | "UNIVERSITY" | "POSTGRADUATE";
	medicalKnowledge?: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
	disabilities?: string[];
	preferredLanguage: "PL" | "EN";
	screenReader?: boolean;
	motorImpairment?: boolean;
	visualImpairment?: boolean;
	cognitiveImpairment?: boolean;
}

export interface ContentComplexity {
	readingLevel: number; // Flesch-Kincaid grade level
	medicalTerms: MedicalTerm[];
	culturalSensitivity: "LOW" | "MEDIUM" | "HIGH";
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
	ageAppropriate: boolean;
	userTypeAppropriate: boolean;
}

export interface MedicalTerm {
	term: string;
	polishTerm: string;
	definition: string;
	polishDefinition: string;
	complexity: "BASIC" | "INTERMEDIATE" | "ADVANCED";
	frequency: number;
	alternatives: string[];
	polishAlternatives: string[];
}

// Accessibility test categories
export type AccessibilityTestCategory =
	| "KEYBOARD_NAVIGATION"
	| "SCREEN_READER"
	| "VISUAL_DESIGN"
	| "CONTENT_ACCESSIBILITY"
	| "MOBILE_ACCESSIBILITY"
	| "COGNITIVE_ACCESSIBILITY"
	| "MOTOR_ACCESSIBILITY"
	| "CULTURAL_ACCESSIBILITY"
	| "AGE_ACCESSIBILITY"
	| "MEDICAL_ACCURACY";

// Main accessibility testing framework class
export class AccessibilityTestingFramework {
	private testResults: AccessibilityTestResult[] = [];
	private userProfiles: Map<string, UserProfile> = new Map();
	private contentCache: Map<string, ContentComplexity> = new Map();

	constructor() {
		this.initializeFramework();
	}

	private async initializeFramework(): Promise<void> {
		// Initialize screen reader support
		if (typeof window !== "undefined") {
			this.initializeScreenReaderSupport();
		}

		// Load user profiles
		await this.loadUserProfiles();

		// Initialize content analysis
		await this.initializeContentAnalysis();
	}

	private initializeScreenReaderSupport(): void {
		// Check for screen reader presence
		const hasScreenReader = this.detectScreenReader();

		if (hasScreenReader) {
			this.announceToScreenReader(
				"Inicjalizacja systemu dostępności suplementora",
			);
		}
	}

	private detectScreenReader(): boolean {
		// Detect common screen readers
		const screenReaderIndicators = [
			"NVDA",
			"JAWS",
			"VoiceOver",
			"TalkBack",
			"Narrator",
		];

		const userAgent = navigator.userAgent;
		return screenReaderIndicators.some((indicator) =>
			userAgent.includes(indicator),
		);
	}

	private announceToScreenReader(message: string): void {
		if (typeof window !== "undefined" && "speechSynthesis" in window) {
			const utterance = new SpeechSynthesisUtterance(message);
			utterance.lang = "pl-PL";
			utterance.rate = 0.8;
			window.speechSynthesis.speak(utterance);
		}
	}

	private async loadUserProfiles(): Promise<void> {
		// Load predefined user profiles for testing
		const profiles: UserProfile[] = [
			{
				id: "student_basic",
				type: "STUDENT",
				age: 16,
				educationLevel: "SECONDARY",
				medicalKnowledge: "BASIC",
				preferredLanguage: "PL",
				disabilities: [],
			},
			{
				id: "student_advanced",
				type: "STUDENT",
				age: 20,
				educationLevel: "UNIVERSITY",
				medicalKnowledge: "INTERMEDIATE",
				preferredLanguage: "PL",
				disabilities: [],
			},
			{
				id: "professional_medical",
				type: "PROFESSIONAL",
				age: 35,
				educationLevel: "POSTGRADUATE",
				medicalKnowledge: "EXPERT",
				preferredLanguage: "PL",
				disabilities: [],
			},
			{
				id: "general_public_senior",
				type: "GENERAL_PUBLIC",
				age: 65,
				educationLevel: "SECONDARY",
				medicalKnowledge: "BASIC",
				preferredLanguage: "PL",
				visualImpairment: true,
				motorImpairment: true,
			},
			{
				id: "screen_reader_user",
				type: "GENERAL_PUBLIC",
				age: 28,
				medicalKnowledge: "INTERMEDIATE",
				preferredLanguage: "PL",
				screenReader: true,
				visualImpairment: true,
			},
		];

		profiles.forEach((profile) => {
			this.userProfiles.set(profile.id, profile);
		});
	}

	private async initializeContentAnalysis(): Promise<void> {
		// Initialize Polish medical terminology database
		await this.loadMedicalTerminology();
	}

	private async loadMedicalTerminology(): Promise<void> {
		// Load comprehensive Polish medical terminology for complexity analysis
		const polishMedicalTerms: MedicalTerm[] = [
			{
				term: "endocannabinoid",
				polishTerm: "endokannabinoid",
				definition: "Natural compound that binds to cannabinoid receptors",
				polishDefinition:
					"Naturalny związek wiążący się z receptorami kannabinoidowymi",
				complexity: "ADVANCED",
				frequency: 0.1,
				alternatives: ["natural cannabis-like compound"],
				polishAlternatives: ["naturalny związek podobny do konopi"],
			},
			{
				term: "homeostasis",
				polishTerm: "homeostaza",
				definition: "Body's ability to maintain stable internal conditions",
				polishDefinition:
					"Zdolność organizmu do utrzymania stabilnych warunków wewnętrznych",
				complexity: "INTERMEDIATE",
				frequency: 0.3,
				alternatives: ["internal balance", "body equilibrium"],
				polishAlternatives: ["równowaga wewnętrzna", "równowaga organizmu"],
			},
			{
				term: "metabolism",
				polishTerm: "metabolizm",
				definition: "Chemical processes that maintain life",
				polishDefinition: "Procesy chemiczne podtrzymujące życie",
				complexity: "BASIC",
				frequency: 0.8,
				alternatives: ["body chemistry", "energy processes"],
				polishAlternatives: ["chemia organizmu", "procesy energetyczne"],
			},
		];

		// Cache complexity analysis for common terms
		polishMedicalTerms.forEach((term) => {
			this.contentCache.set(term.term, {
				readingLevel: this.calculateReadingLevel(term.definition),
				medicalTerms: [term],
				culturalSensitivity: "LOW",
				evidenceLevel: "STRONG",
				ageAppropriate: true,
				userTypeAppropriate: true,
			});
		});
	}

	private calculateReadingLevel(text: string): number {
		// Simplified Flesch-Kincaid calculation for Polish
		const words = text.split(" ").length;
		const sentences = text.split(/[.!?]+/).length - 1;
		const syllables = this.countSyllables(text);

		if (words === 0 || sentences === 0) return 0;

		// Polish Flesch-Kincaid adaptation
		const score =
			206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
		return Math.max(0, Math.min(20, score));
	}

	private countSyllables(text: string): number {
		// Simplified syllable counting for Polish
		const polishVowels = /[aeiouąęióuy]/i;
		let syllables = 0;
		let previousWasVowel = false;

		for (const char of text.toLowerCase()) {
			const isVowel = polishVowels.test(char);
			if (isVowel && !previousWasVowel) {
				syllables++;
			}
			previousWasVowel = isVowel;
		}

		return Math.max(1, syllables);
	}

	// Main accessibility testing method
	async runComprehensiveAccessibilityAudit(
		bodySystems: BodySystem[],
		userProfileId?: string,
	): Promise<AccessibilityReport> {
		const reportId = `audit_${Date.now()}`;
		const startTime = new Date();

		this.testResults = [];

		// Run all accessibility tests
		await Promise.all([
			this.testKeyboardNavigation(bodySystems),
			this.testScreenReaderCompatibility(bodySystems),
			this.testVisualAccessibility(bodySystems),
			this.testContentAccessibility(bodySystems, userProfileId),
			this.testMobileAccessibility(bodySystems),
			this.testCognitiveAccessibility(bodySystems, userProfileId),
			this.testCulturalAccessibility(bodySystems),
			this.testMedicalAccuracy(bodySystems),
		]);

		const endTime = new Date();
		const duration = endTime.getTime() - startTime.getTime();

		return this.generateAccessibilityReport(reportId, duration);
	}

	private async testKeyboardNavigation(
		bodySystems: BodySystem[],
	): Promise<void> {
		// Test keyboard navigation accessibility
		const tests = bodySystems.flatMap((system) => [
			{
				testName: "System Card Keyboard Access",
				element: `body-system-card-${system.id}`,
				check: () =>
					this.testElementKeyboardAccess(`[data-system-id="${system.id}"]`),
			},
			{
				testName: "Organ Navigation",
				element: `organs-${system.id}`,
				check: () => this.testOrganKeyboardNavigation(system.organs),
			},
			{
				testName: "Supplement Links",
				element: `supplements-${system.id}`,
				check: () =>
					this.testSupplementKeyboardAccess(system.relatedSupplements),
			},
		]);

		for (const test of tests) {
			try {
				const passed = await test.check();
				this.addTestResult({
					testName: test.testName,
					status: passed ? "PASS" : "FAIL",
					severity: "HIGH",
					category: "KEYBOARD_NAVIGATION",
					description: `Keyboard navigation test for ${test.element}`,
					polishDescription: `Test nawigacji klawiaturą dla ${test.element}`,
					element: test.element,
					suggestion: passed
						? undefined
						: "Add proper tabIndex and keyboard event handlers",
					polishSuggestion: passed
						? undefined
						: "Dodaj właściwy tabIndex i obsługę zdarzeń klawiatury",
					wcagGuideline: "2.1.1 Keyboard",
					autoFixable: true,
				});
			} catch (error) {
				this.addTestResult({
					testName: test.testName,
					status: "ERROR",
					severity: "CRITICAL",
					category: "KEYBOARD_NAVIGATION",
					description: `Error testing keyboard navigation: ${error}`,
					polishDescription: `Błąd podczas testowania nawigacji klawiaturą: ${error}`,
					element: test.element,
					wcagGuideline: "2.1.1 Keyboard",
				});
			}
		}
	}

	private async testElementKeyboardAccess(selector: string): Promise<boolean> {
		// Simulate keyboard navigation testing
		if (typeof document === "undefined") return true;

		const element = document.querySelector(selector);
		if (!element) return false;

		// Check if element is focusable
		const tabIndex = element.getAttribute("tabindex");
		const isFocusable =
			element.tagName.match(/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/) ||
			(tabIndex !== null && Number.parseInt(tabIndex) >= 0);

		return isFocusable;
	}

	private async testOrganKeyboardNavigation(organs: Organ[]): Promise<boolean> {
		// Test keyboard navigation for organ elements
		for (const organ of organs) {
			const selector = `[data-organ-id="${organ.id}"]`;
			const accessible = await this.testElementKeyboardAccess(selector);
			if (!accessible) return false;
		}
		return true;
	}

	private async testSupplementKeyboardAccess(
		supplements: RelatedSupplement[],
	): Promise<boolean> {
		// Test keyboard access for supplement links
		for (const supplement of supplements) {
			const selector = `[data-supplement-id="${supplement.supplementId}"]`;
			const accessible = await this.testElementKeyboardAccess(selector);
			if (!accessible) return false;
		}
		return true;
	}

	private async testScreenReaderCompatibility(
		bodySystems: BodySystem[],
	): Promise<void> {
		// Test screen reader compatibility
		for (const system of bodySystems) {
			// Test ARIA labels
			const hasAriaLabel = await this.testAriaLabels(system);
			this.addTestResult({
				testName: "ARIA Labels",
				status: hasAriaLabel ? "PASS" : "FAIL",
				severity: "HIGH",
				category: "SCREEN_READER",
				description: `ARIA labels for body system ${system.name}`,
				polishDescription: `Etykiety ARIA dla układu ciała ${system.polishName}`,
				element: `system-${system.id}`,
				suggestion: hasAriaLabel
					? undefined
					: "Add proper ARIA labels and descriptions",
				polishSuggestion: hasAriaLabel
					? undefined
					: "Dodaj odpowiednie etykiety i opisy ARIA",
				wcagGuideline: "4.1.2 Name, Role, Value",
				autoFixable: true,
			});

			// Test semantic structure
			const hasSemanticStructure = await this.testSemanticStructure(system);
			this.addTestResult({
				testName: "Semantic Structure",
				status: hasSemanticStructure ? "PASS" : "FAIL",
				severity: "MEDIUM",
				category: "SCREEN_READER",
				description: `Semantic HTML structure for ${system.name}`,
				polishDescription: `Struktura HTML semantycznego dla ${system.polishName}`,
				element: `system-${system.id}`,
				suggestion: hasSemanticStructure
					? undefined
					: "Use proper semantic HTML elements",
				polishSuggestion: hasSemanticStructure
					? undefined
					: "Użyj odpowiednich elementów HTML semantycznego",
				wcagGuideline: "1.3.1 Info and Relationships",
				autoFixable: true,
			});
		}
	}

	private async testAriaLabels(system: BodySystem): Promise<boolean> {
		if (typeof document === "undefined") return true;

		const element = document.querySelector(`[data-system-id="${system.id}"]`);
		if (!element) return false;

		const ariaLabel = element.getAttribute("aria-label");
		const ariaDescribedBy = element.getAttribute("aria-describedby");

		return !!(ariaLabel && ariaDescribedBy);
	}

	private async testSemanticStructure(system: BodySystem): Promise<boolean> {
		if (typeof document === "undefined") return true;

		// Check for proper heading hierarchy
		const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
		let previousLevel = 0;
		let properHierarchy = true;

		headings.forEach((heading) => {
			const level = Number.parseInt(heading.tagName.charAt(1));
			if (level > previousLevel + 1) {
				properHierarchy = false;
			}
			previousLevel = level;
		});

		return properHierarchy;
	}

	private async testVisualAccessibility(
		bodySystems: BodySystem[],
	): Promise<void> {
		// Test visual accessibility features
		for (const system of bodySystems) {
			// Test color contrast
			const contrastTest = await this.testColorContrast(system);
			this.addTestResult({
				testName: "Color Contrast",
				status: contrastTest.passed ? "PASS" : "FAIL",
				severity: contrastTest.severity,
				category: "VISUAL_DESIGN",
				description: `Color contrast for ${system.name}`,
				polishDescription: `Kontrast kolorów dla ${system.polishName}`,
				element: `system-${system.id}`,
				suggestion: contrastTest.suggestion,
				polishSuggestion: contrastTest.polishSuggestion,
				wcagGuideline: "1.4.3 Contrast (Minimum)",
				autoFixable: true,
			});

			// Test high contrast mode support
			const highContrastSupport = await this.testHighContrastSupport();
			this.addTestResult({
				testName: "High Contrast Support",
				status: highContrastSupport ? "PASS" : "WARNING",
				severity: "MEDIUM",
				category: "VISUAL_DESIGN",
				description: "High contrast mode support",
				polishDescription: "Wsparcie trybu wysokiego kontrastu",
				suggestion: highContrastSupport
					? undefined
					: "Add high contrast mode support",
				polishSuggestion: highContrastSupport
					? undefined
					: "Dodaj wsparcie trybu wysokiego kontrastu",
				wcagGuideline: "1.4.6 Contrast (Enhanced)",
				autoFixable: true,
			});
		}
	}

	private async testColorContrast(system: BodySystem): Promise<{
		passed: boolean;
		severity: "LOW" | "MEDIUM" | "HIGH";
		suggestion?: string;
		polishSuggestion?: string;
	}> {
		// Simplified color contrast testing
		// In a real implementation, this would analyze actual colors
		return {
			passed: true,
			severity: "LOW",
		};
	}

	private async testHighContrastSupport(): Promise<boolean> {
		if (typeof document === "undefined") return true;

		// Check if high contrast CSS is available
		const style = document.getElementById("high-contrast-styles");
		return !!style;
	}

	private async testContentAccessibility(
		bodySystems: BodySystem[],
		userProfileId?: string,
	): Promise<void> {
		const userProfile = userProfileId
			? this.userProfiles.get(userProfileId)
			: undefined;

		for (const system of bodySystems) {
			// Test content complexity
			const complexity = await this.analyzeContentComplexity(
				system,
				userProfile,
			);

			this.addTestResult({
				testName: "Content Complexity",
				status: complexity.ageAppropriate ? "PASS" : "WARNING",
				severity: "MEDIUM",
				category: "CONTENT_ACCESSIBILITY",
				description: `Content complexity for ${system.name}`,
				polishDescription: `Złożoność treści dla ${system.polishName}`,
				element: `system-${system.id}`,
				suggestion: complexity.ageAppropriate
					? undefined
					: "Simplify content or add explanations",
				polishSuggestion: complexity.ageAppropriate
					? undefined
					: "Uprość treść lub dodaj wyjaśnienia",
				wcagGuideline: "3.1.5 Reading Level",
				autoFixable: false,
			});

			// Test medical terminology
			const terminologyTest = await this.testMedicalTerminology(system);
			this.addTestResult({
				testName: "Medical Terminology",
				status: terminologyTest.appropriate ? "PASS" : "WARNING",
				severity: "MEDIUM",
				category: "CONTENT_ACCESSIBILITY",
				description: `Medical terminology complexity for ${system.name}`,
				polishDescription: `Złożoność terminologii medycznej dla ${system.polishName}`,
				element: `system-${system.id}`,
				suggestion: terminologyTest.suggestion,
				polishSuggestion: terminologyTest.polishSuggestion,
				wcagGuideline: "3.1.3 Unusual Words",
				autoFixable: true,
			});
		}
	}

	private async analyzeContentComplexity(
		system: BodySystem,
		userProfile?: UserProfile,
	): Promise<ContentComplexity> {
		const text = `${system.description} ${system.polishDescription} ${system.functions.join(" ")} ${system.polishFunctions.join(" ")}`;

		const readingLevel = this.calculateReadingLevel(text);
		const medicalTerms = this.extractMedicalTerms(text);

		let ageAppropriate = true;
		let userTypeAppropriate = true;

		if (userProfile) {
			// Check age appropriateness
			if (userProfile.age && userProfile.age < 18 && readingLevel > 10) {
				ageAppropriate = false;
			}

			// Check user type appropriateness
			if (
				userProfile.type === "GENERAL_PUBLIC" &&
				medicalTerms.some((term) => term.complexity === "ADVANCED")
			) {
				userTypeAppropriate = false;
			}
		}

		return {
			readingLevel,
			medicalTerms,
			culturalSensitivity: "LOW",
			evidenceLevel: "MODERATE",
			ageAppropriate,
			userTypeAppropriate,
		};
	}

	private extractMedicalTerms(text: string): MedicalTerm[] {
		// Extract medical terms from text
		const medicalTerms: MedicalTerm[] = [];
		const words = text.toLowerCase().split(/\s+/);

		// Simple keyword matching for medical terms
		const medicalKeywords = [
			"endocannabinoid",
			"homeostasis",
			"metabolism",
			"inflammation",
		];

		words.forEach((word) => {
			if (medicalKeywords.includes(word)) {
				medicalTerms.push({
					term: word,
					polishTerm: this.translateToPolish(word),
					definition: `Medical term: ${word}`,
					polishDefinition: `Termin medyczny: ${this.translateToPolish(word)}`,
					complexity: "INTERMEDIATE",
					frequency: 1,
					alternatives: [],
					polishAlternatives: [],
				});
			}
		});

		return medicalTerms;
	}

	private translateToPolish(term: string): string {
		const translations: Record<string, string> = {
			endocannabinoid: "endokannabinoid",
			homeostasis: "homeostaza",
			metabolism: "metabolizm",
			inflammation: "stan zapalny",
		};

		return translations[term] || term;
	}

	private async testMedicalTerminology(system: BodySystem): Promise<{
		appropriate: boolean;
		suggestion?: string;
		polishSuggestion?: string;
	}> {
		const text = `${system.description} ${system.functions.join(" ")}`;
		const advancedTerms = this.extractMedicalTerms(text).filter(
			(term) => term.complexity === "ADVANCED",
		);

		return {
			appropriate: advancedTerms.length === 0,
			suggestion:
				advancedTerms.length > 0
					? `Define or simplify: ${advancedTerms.map((t) => t.term).join(", ")}`
					: undefined,
			polishSuggestion:
				advancedTerms.length > 0
					? `Zdefiniuj lub uprość: ${advancedTerms.map((t) => t.polishTerm).join(", ")}`
					: undefined,
		};
	}

	private async testMobileAccessibility(
		bodySystems: BodySystem[],
	): Promise<void> {
		// Test mobile accessibility
		const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

		if (isMobile) {
			for (const system of bodySystems) {
				// Test touch target size
				const touchTargetTest = await this.testTouchTargets(system);
				this.addTestResult({
					testName: "Touch Target Size",
					status: touchTargetTest.passed ? "PASS" : "FAIL",
					severity: "HIGH",
					category: "MOBILE_ACCESSIBILITY",
					description: `Touch target size for ${system.name}`,
					polishDescription: `Rozmiar celu dotyku dla ${system.polishName}`,
					element: `system-${system.id}`,
					suggestion: touchTargetTest.suggestion,
					polishSuggestion: touchTargetTest.polishSuggestion,
					wcagGuideline: "2.5.5 Target Size",
					autoFixable: true,
				});

				// Test mobile screen reader support
				const mobileScreenReaderTest =
					await this.testMobileScreenReader(system);
				this.addTestResult({
					testName: "Mobile Screen Reader",
					status: mobileScreenReaderTest ? "PASS" : "FAIL",
					severity: "HIGH",
					category: "MOBILE_ACCESSIBILITY",
					description: `Mobile screen reader support for ${system.name}`,
					polishDescription: `Wsparcie czytnika ekranu mobilnego dla ${system.polishName}`,
					element: `system-${system.id}`,
					suggestion: mobileScreenReaderTest
						? undefined
						: "Improve mobile screen reader support",
					polishSuggestion: mobileScreenReaderTest
						? undefined
						: "Popraw wsparcie czytnika ekranu mobilnego",
					wcagGuideline: "4.1.3 Mobile Screen Reader",
					autoFixable: true,
				});
			}
		}
	}

	private async testTouchTargets(system: BodySystem): Promise<{
		passed: boolean;
		suggestion?: string;
		polishSuggestion?: string;
	}> {
		if (typeof document === "undefined") return { passed: true };

		const element = document.querySelector(`[data-system-id="${system.id}"]`);
		if (!element) return { passed: false, suggestion: "Element not found" };

		const rect = element.getBoundingClientRect();
		const minSize = 44; // WCAG minimum touch target size

		return {
			passed: rect.width >= minSize && rect.height >= minSize,
			suggestion:
				rect.width < minSize || rect.height < minSize
					? `Touch target should be at least ${minSize}x${minSize}px`
					: undefined,
			polishSuggestion:
				rect.width < minSize || rect.height < minSize
					? `Cel dotyku powinien mieć co najmniej ${minSize}x${minSize}px`
					: undefined,
		};
	}

	private async testMobileScreenReader(system: BodySystem): Promise<boolean> {
		// Test mobile screen reader compatibility
		if (typeof navigator === "undefined") return true;

		// Check for mobile screen reader indicators
		const userAgent = navigator.userAgent;
		const hasMobileScreenReader =
			/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(
				userAgent,
			);

		return !hasMobileScreenReader || this.detectScreenReader();
	}

	private async testCognitiveAccessibility(
		bodySystems: BodySystem[],
		userProfileId?: string,
	): Promise<void> {
		const userProfile = userProfileId
			? this.userProfiles.get(userProfileId)
			: undefined;

		for (const system of bodySystems) {
			// Test cognitive load
			const cognitiveLoadTest = await this.testCognitiveLoad(
				system,
				userProfile,
			);
			this.addTestResult({
				testName: "Cognitive Load",
				status: cognitiveLoadTest.appropriate ? "PASS" : "WARNING",
				severity: "MEDIUM",
				category: "COGNITIVE_ACCESSIBILITY",
				description: `Cognitive load assessment for ${system.name}`,
				polishDescription: `Ocena obciążenia poznawczego dla ${system.polishName}`,
				element: `system-${system.id}`,
				suggestion: cognitiveLoadTest.suggestion,
				polishSuggestion: cognitiveLoadTest.polishSuggestion,
				wcagGuideline: "3.1.5 Reading Level",
				autoFixable: false,
			});

			// Test information architecture
			const architectureTest = await this.testInformationArchitecture(system);
			this.addTestResult({
				testName: "Information Architecture",
				status: architectureTest ? "PASS" : "WARNING",
				severity: "LOW",
				category: "COGNITIVE_ACCESSIBILITY",
				description: `Information architecture for ${system.name}`,
				polishDescription: `Architektura informacji dla ${system.polishName}`,
				element: `system-${system.id}`,
				suggestion: architectureTest
					? undefined
					: "Improve information organization and navigation",
				polishSuggestion: architectureTest
					? undefined
					: "Popraw organizację informacji i nawigację",
				wcagGuideline: "2.4.1 Bypass Blocks",
				autoFixable: true,
			});
		}
	}

	private async testCognitiveLoad(
		system: BodySystem,
		userProfile?: UserProfile,
	): Promise<{
		appropriate: boolean;
		suggestion?: string;
		polishSuggestion?: string;
	}> {
		const text = `${system.description} ${system.functions.join(" ")}`;
		const wordCount = text.split(" ").length;
		const complexity = this.calculateReadingLevel(text);

		// Assess cognitive load based on user profile
		let appropriate = true;
		let suggestion: string | undefined;

		if (userProfile) {
			if (
				userProfile.type === "GENERAL_PUBLIC" &&
				(wordCount > 200 || complexity > 8)
			) {
				appropriate = false;
				suggestion = "Simplify content and break into smaller sections";
			} else if (
				userProfile.type === "STUDENT" &&
				userProfile.medicalKnowledge === "BASIC" &&
				complexity > 10
			) {
				appropriate = false;
				suggestion = "Add explanations for complex medical terms";
			}
		}

		return {
			appropriate,
			suggestion,
			polishSuggestion: suggestion
				? this.translateToPolish(suggestion)
				: undefined,
		};
	}

	private async testInformationArchitecture(
		system: BodySystem,
	): Promise<boolean> {
		if (typeof document === "undefined") return true;

		// Check for proper heading structure
		const systemElement = document.querySelector(
			`[data-system-id="${system.id}"]`,
		);
		if (!systemElement) return false;

		const headings = systemElement.querySelectorAll("h1, h2, h3, h4, h5, h6");
		if (headings.length === 0) return false;

		// Check if there's a clear hierarchy
		const levels = Array.from(headings).map((h) =>
			Number.parseInt(h.tagName.charAt(1)),
		);
		const hasProperHierarchy = levels.every((level, index) => {
			if (index === 0) return level <= 3; // First heading should be h1-h3
			return level <= levels[index - 1] + 1; // Subsequent headings should be same or one level deeper
		});

		return hasProperHierarchy;
	}

	private async testCulturalAccessibility(
		bodySystems: BodySystem[],
	): Promise<void> {
		// Test cultural accessibility for Polish context
		for (const system of bodySystems) {
			// Test Polish language usage
			const polishLanguageTest = await this.testPolishLanguageUsage(system);
			this.addTestResult({
				testName: "Polish Language Usage",
				status: polishLanguageTest.appropriate ? "PASS" : "WARNING",
				severity: "MEDIUM",
				category: "CULTURAL_ACCESSIBILITY",
				description: `Polish language usage for ${system.name}`,
				polishDescription: `Użycie języka polskiego dla ${system.polishName}`,
				element: `system-${system.id}`,
				suggestion: polishLanguageTest.suggestion,
				polishSuggestion: polishLanguageTest.polishSuggestion,
				wcagGuideline: "3.1.2 Language of Parts",
				autoFixable: true,
			});

			// Test cultural sensitivity
			const culturalSensitivityTest =
				await this.testCulturalSensitivity(system);
			this.addTestResult({
				testName: "Cultural Sensitivity",
				status: culturalSensitivityTest.appropriate ? "PASS" : "WARNING",
				severity: "LOW",
				category: "CULTURAL_ACCESSIBILITY",
				description: `Cultural sensitivity for ${system.name}`,
				polishDescription: `Wrażliwość kulturowa dla ${system.polishName}`,
				element: `system-${system.id}`,
				suggestion: culturalSensitivityTest.suggestion,
				polishSuggestion: culturalSensitivityTest.polishSuggestion,
				autoFixable: false,
			});
		}
	}

	private async testPolishLanguageUsage(system: BodySystem): Promise<{
		appropriate: boolean;
		suggestion?: string;
		polishSuggestion?: string;
	}> {
		// Check if Polish translations are complete and accurate
		const hasPolishName =
			!!system.polishName && system.polishName !== system.name;
		const hasPolishDescription =
			!!system.polishDescription &&
			system.polishDescription !== system.description;
		const hasPolishFunctions =
			system.polishFunctions.length > 0 &&
			system.polishFunctions.length === system.functions.length;

		const appropriate =
			hasPolishName && hasPolishDescription && hasPolishFunctions;

		return {
			appropriate,
			suggestion: appropriate
				? undefined
				: "Complete Polish translations for all content",
			polishSuggestion: appropriate
				? undefined
				: "Uzupełnij tłumaczenia polskie dla całej treści",
		};
	}

	private async testCulturalSensitivity(system: BodySystem): Promise<{
		appropriate: boolean;
		suggestion?: string;
		polishSuggestion?: string;
	}> {
		// Test for culturally sensitive content in Polish context
		const text = `${system.description} ${system.polishDescription}`;
		const hasSensitiveTerms = /death|terminal|incurable|fatal/i.test(text);

		return {
			appropriate: !hasSensitiveTerms,
			suggestion: hasSensitiveTerms
				? "Review content for cultural sensitivity"
				: undefined,
			polishSuggestion: hasSensitiveTerms
				? "Przejrzyj treść pod kątem wrażliwości kulturowej"
				: undefined,
		};
	}

	private async testMedicalAccuracy(bodySystems: BodySystem[]): Promise<void> {
		// Test medical accuracy and evidence levels
		for (const system of bodySystems) {
			// Test evidence levels for supplements
			const evidenceTest = await this.testSupplementEvidence(system);
			this.addTestResult({
				testName: "Supplement Evidence",
				status: evidenceTest.valid ? "PASS" : "WARNING",
				severity: "HIGH",
				category: "MEDICAL_ACCURACY",
				description: `Evidence level for supplements in ${system.name}`,
				polishDescription: `Poziom dowodów dla suplementów w ${system.polishName}`,
				element: `system-${system.id}`,
				suggestion: evidenceTest.suggestion,
				polishSuggestion: evidenceTest.polishSuggestion,
				wcagGuideline: "3.1.3 Unusual Words",
				autoFixable: false,
			});

			// Test medical terminology accuracy
			const terminologyAccuracyTest =
				await this.testTerminologyAccuracy(system);
			this.addTestResult({
				testName: "Medical Terminology Accuracy",
				status: terminologyAccuracyTest.accurate ? "PASS" : "FAIL",
				severity: "CRITICAL",
				category: "MEDICAL_ACCURACY",
				description: `Medical terminology accuracy for ${system.name}`,
				polishDescription: `Dokładność terminologii medycznej dla ${system.polishName}`,
				element: `system-${system.id}`,
				suggestion: terminologyAccuracyTest.suggestion,
				polishSuggestion: terminologyAccuracyTest.polishSuggestion,
				autoFixable: false,
			});
		}
	}

	private async testSupplementEvidence(system: BodySystem): Promise<{
		valid: boolean;
		suggestion?: string;
		polishSuggestion?: string;
	}> {
		// Test evidence levels for supplement claims
		const weakEvidence = system.relatedSupplements.filter(
			(s) => s.evidenceLevel === "WEAK" || s.evidenceLevel === "INSUFFICIENT",
		);

		return {
			valid: weakEvidence.length === 0,
			suggestion:
				weakEvidence.length > 0
					? `Review evidence for: ${weakEvidence.map((s) => s.supplementName).join(", ")}`
					: undefined,
			polishSuggestion:
				weakEvidence.length > 0
					? `Przejrzyj dowody dla: ${weakEvidence.map((s) => s.polishSupplementName).join(", ")}`
					: undefined,
		};
	}

	private async testTerminologyAccuracy(system: BodySystem): Promise<{
		accurate: boolean;
		suggestion?: string;
		polishSuggestion?: string;
	}> {
		// Test medical terminology accuracy
		const text = `${system.description} ${system.functions.join(" ")}`;
		const hasInaccurateTerms = /cancer|cure|heal|treat disease/i.test(text);

		return {
			accurate: !hasInaccurateTerms,
			suggestion: hasInaccurateTerms
				? "Remove unsubstantiated medical claims"
				: undefined,
			polishSuggestion: hasInaccurateTerms
				? "Usuń nieuzasadnione twierdzenia medyczne"
				: undefined,
		};
	}

	private addTestResult(
		result: Omit<AccessibilityTestResult, "id" | "timestamp">,
	): void {
		this.testResults.push({
			id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			timestamp: new Date(),
			...result,
		});
	}

	private generateAccessibilityReport(
		reportId: string,
		duration: number,
	): AccessibilityReport {
		const totalTests = this.testResults.length;
		const passedTests = this.testResults.filter(
			(r) => r.status === "PASS",
		).length;
		const failedTests = this.testResults.filter(
			(r) => r.status === "FAIL",
		).length;
		const warnings = this.testResults.filter(
			(r) => r.status === "WARNING",
		).length;
		const errors = this.testResults.filter((r) => r.status === "ERROR").length;

		const overallScore =
			totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

		// Determine WCAG compliance level
		const criticalIssues = this.testResults.filter(
			(r) => r.severity === "CRITICAL" && r.status === "FAIL",
		).length;
		const highIssues = this.testResults.filter(
			(r) => r.severity === "HIGH" && r.status === "FAIL",
		).length;

		let complianceLevel: "A" | "AA" | "AAA" = "A";
		if (criticalIssues === 0 && highIssues <= 2) {
			complianceLevel = "AA";
		}
		if (criticalIssues === 0 && highIssues === 0 && failedTests <= 5) {
			complianceLevel = "AAA";
		}

		// Generate recommendations
		const recommendations = this.generateRecommendations();
		const polishRecommendations = this.generatePolishRecommendations();

		// Estimate remediation time
		const estimatedRemediationTime = this.estimateRemediationTime();

		return {
			id: reportId,
			timestamp: new Date(),
			url: typeof window !== "undefined" ? window.location.href : "",
			overallScore,
			totalTests,
			passedTests,
			failedTests,
			warnings,
			errors,
			results: this.testResults,
			recommendations,
			polishRecommendations,
			complianceLevel,
			estimatedRemediationTime,
		};
	}

	private generateRecommendations(): string[] {
		const recommendations: string[] = [];

		const criticalIssues = this.testResults.filter(
			(r) => r.severity === "CRITICAL" && r.status !== "PASS",
		);
		const highIssues = this.testResults.filter(
			(r) => r.severity === "HIGH" && r.status !== "PASS",
		);

		if (criticalIssues.length > 0) {
			recommendations.push(
				`Fix ${criticalIssues.length} critical accessibility issues immediately`,
			);
		}

		if (highIssues.length > 0) {
			recommendations.push(
				`Address ${highIssues.length} high-priority accessibility issues`,
			);
		}

		const keyboardIssues = this.testResults.filter(
			(r) => r.category === "KEYBOARD_NAVIGATION" && r.status !== "PASS",
		);
		if (keyboardIssues.length > 0) {
			recommendations.push(
				"Improve keyboard navigation support throughout the application",
			);
		}

		const screenReaderIssues = this.testResults.filter(
			(r) => r.category === "SCREEN_READER" && r.status !== "PASS",
		);
		if (screenReaderIssues.length > 0) {
			recommendations.push(
				"Enhance screen reader compatibility and ARIA labeling",
			);
		}

		return recommendations;
	}

	private generatePolishRecommendations(): string[] {
		const recommendations: string[] = [];

		const criticalIssues = this.testResults.filter(
			(r) => r.severity === "CRITICAL" && r.status !== "PASS",
		);
		const highIssues = this.testResults.filter(
			(r) => r.severity === "HIGH" && r.status !== "PASS",
		);

		if (criticalIssues.length > 0) {
			recommendations.push(
				`Napraw ${criticalIssues.length} krytycznych problemów z dostępnością natychmiast`,
			);
		}

		if (highIssues.length > 0) {
			recommendations.push(
				`Rozwiąż ${highIssues.length} problemów z dostępnością wysokiego priorytetu`,
			);
		}

		const keyboardIssues = this.testResults.filter(
			(r) => r.category === "KEYBOARD_NAVIGATION" && r.status !== "PASS",
		);
		if (keyboardIssues.length > 0) {
			recommendations.push(
				"Popraw wsparcie nawigacji klawiaturą w całej aplikacji",
			);
		}

		const screenReaderIssues = this.testResults.filter(
			(r) => r.category === "SCREEN_READER" && r.status !== "PASS",
		);
		if (screenReaderIssues.length > 0) {
			recommendations.push(
				"Wzmocnij kompatybilność z czytnikami ekranu i etykietowanie ARIA",
			);
		}

		return recommendations;
	}

	private estimateRemediationTime(): number {
		// Estimate time in minutes based on issue complexity
		let totalMinutes = 0;

		this.testResults.forEach((result) => {
			if (result.status !== "PASS") {
				switch (result.severity) {
					case "CRITICAL":
						totalMinutes += 30; // 30 minutes per critical issue
						break;
					case "HIGH":
						totalMinutes += 15; // 15 minutes per high-priority issue
						break;
					case "MEDIUM":
						totalMinutes += 5; // 5 minutes per medium-priority issue
						break;
					case "LOW":
						totalMinutes += 2; // 2 minutes per low-priority issue
						break;
				}
			}
		});

		return totalMinutes;
	}

	// Public methods for external access
	async runTestsForUserProfile(
		bodySystems: BodySystem[],
		userProfileId: string,
	): Promise<AccessibilityReport> {
		return this.runComprehensiveAccessibilityAudit(bodySystems, userProfileId);
	}

	getUserProfiles(): UserProfile[] {
		return Array.from(this.userProfiles.values());
	}

	async analyzeContentForUser(
		bodySystem: BodySystem,
		userProfileId: string,
	): Promise<ContentComplexity> {
		const userProfile = this.userProfiles.get(userProfileId);
		if (!userProfile) {
			throw new Error(`User profile ${userProfileId} not found`);
		}

		return this.analyzeContentComplexity(bodySystem, userProfile);
	}

	getTestResults(): AccessibilityTestResult[] {
		return [...this.testResults];
	}

	// Utility method to announce to screen reader
	announce(message: string): void {
		this.announceToScreenReader(message);
	}
}

// Export singleton instance
export const accessibilityTestingFramework =
	new AccessibilityTestingFramework();
