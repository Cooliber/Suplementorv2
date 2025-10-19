"use client";

/**
 * Integration with Existing Suplementor Testing Framework
 * Seamlessly integrates accessibility testing with Playwright and Vitest
 */

import { bodySystems } from "@/data/body-systems";
import { accessibilityReportingSystem } from "./accessibility-reporting";
import { accessibilityTestRunner } from "./accessibility-test-runner";
import { accessibilityTestingFramework } from "./accessibility-testing-framework";
import { contentValidationTools } from "./content-validation-tools";

// Integration with Playwright
export interface PlaywrightAccessibilityConfig {
	enabled: boolean;
	runOnCI: boolean;
	failBuildOnError: boolean;
	generateReports: boolean;
	userProfiles: string[];
	outputDir: string;
}

export class PlaywrightAccessibilityIntegration {
	private config: PlaywrightAccessibilityConfig;

	constructor(config: PlaywrightAccessibilityConfig) {
		this.config = config;
	}

	// Playwright test hooks
	async beforeAll(): Promise<void> {
		if (!this.config.enabled) return;

		console.log("🚀 Initializing accessibility testing framework...");

		// Initialize all accessibility systems
		await accessibilityTestingFramework.runComprehensiveAccessibilityAudit(
			bodySystems,
		);
		await contentValidationTools.validateMultipleSystems(bodySystems);
	}

	async beforeEach(testInfo: any): Promise<void> {
		if (!this.config.enabled) return;

		// Set up accessibility context for each test
		await this.setupTestAccessibilityContext(testInfo);
	}

	async afterEach(testInfo: any, testResult: any): Promise<void> {
		if (!this.config.enabled) return;

		// Capture accessibility state after each test
		await this.captureTestAccessibilityState(testInfo, testResult);
	}

	async afterAll(): Promise<void> {
		if (!this.config.enabled) return;

		// Generate final accessibility reports
		await this.generateFinalReports();
	}

	private async setupTestAccessibilityContext(testInfo: any): Promise<void> {
		// Set up screen reader context
		if (typeof window !== "undefined") {
			// Mock screen reader for testing
			(window as any).speechSynthesis = {
				speak: (utterance: any) => {
					console.log("Screen Reader:", utterance.text);
				},
				cancel: () => {},
				speaking: false,
			};
		}

		// Set up high contrast mode for visual testing
		if (
			testInfo.title.includes("visual") ||
			testInfo.title.includes("contrast")
		) {
			document.body.classList.add("high-contrast-mode");
		}
	}

	private async captureTestAccessibilityState(
		testInfo: any,
		testResult: any,
	): Promise<void> {
		// Capture accessibility violations or issues during test
		const accessibilityState = {
			testName: testInfo.title,
			status: testResult.status,
			duration: testResult.duration,
			error: testResult.error?.message,
			timestamp: new Date().toISOString(),
			url: testInfo.url,
			viewport: {
				width: testInfo.viewport?.width || 1280,
				height: testInfo.viewport?.height || 720,
			},
		};

		// Log accessibility state for analysis
		console.log("Accessibility State:", accessibilityState);
	}

	private async generateFinalReports(): Promise<void> {
		if (!this.config.generateReports) return;

		try {
			// Generate comprehensive accessibility report
			const report = await accessibilityReportingSystem.generateDashboard();

			// Export report in configured format
			const reportContent =
				await accessibilityReportingSystem.exportReport("JSON");

			// Save report to output directory
			await this.saveReportToFile(
				reportContent,
				"accessibility-final-report.json",
			);

			console.log("📊 Accessibility reports generated successfully");
		} catch (error) {
			console.error("❌ Failed to generate accessibility reports:", error);
		}
	}

	private async saveReportToFile(
		content: string,
		filename: string,
	): Promise<void> {
		// In a real implementation, this would save to the file system
		console.log(`💾 Saving report: ${filename}`);
		console.log(content);
	}
}

// Integration with Vitest
export interface VitestAccessibilityConfig {
	enabled: boolean;
	runOnWatch: boolean;
	failOnError: boolean;
	coverage: boolean;
	userProfiles: string[];
}

export class VitestAccessibilityIntegration {
	private config: VitestAccessibilityConfig;

	constructor(config: VitestAccessibilityConfig) {
		this.config = config;
	}

	// Vitest test hooks
	async setup(): Promise<void> {
		if (!this.config.enabled) return;

		console.log("🧪 Setting up accessibility testing for Vitest...");

		// Initialize accessibility testing for unit tests
		await this.initializeUnitTestAccessibility();
	}

	async teardown(): Promise<void> {
		if (!this.config.enabled) return;

		// Clean up accessibility testing state
		await this.cleanupAccessibilityState();
	}

	private async initializeUnitTestAccessibility(): Promise<void> {
		// Set up mock DOM environment for unit tests
		if (typeof document === "undefined") {
			// Create minimal DOM for testing
			const mockDocument = {
				createElement: (tag: string) => ({ tagName: tag.toUpperCase() }),
				querySelector: () => null,
				querySelectorAll: () => [],
				addEventListener: () => {},
				removeEventListener: () => {},
			};

			global.document = mockDocument as any;
		}

		// Initialize accessibility framework for testing
		await accessibilityTestingFramework.runComprehensiveAccessibilityAudit(
			bodySystems.slice(0, 2),
		); // Test subset
	}

	private async cleanupAccessibilityState(): Promise<void> {
		// Clean up any accessibility state
		if (typeof localStorage !== "undefined") {
			localStorage.removeItem("accessibility-test-state");
		}
	}
}

// Manual testing guidelines generator
export class ManualTestingGuidelinesGenerator {
	private userProfiles = [
		{
			id: "student_basic",
			name: "Student (Basic Level)",
			polishName: "Uczeń (poziom podstawowy)",
			characteristics: [
				"Limited medical knowledge",
				"Younger age group (14-16)",
				"May have learning disabilities",
				"Uses mobile devices frequently",
			],
			polishCharacteristics: [
				"Ograniczona wiedza medyczna",
				"Młodsza grupa wiekowa (14-16)",
				"Może mieć trudności w nauce",
				"Często używa urządzeń mobilnych",
			],
			testingFocus: [
				"Content simplicity and clarity",
				"Visual accessibility",
				"Mobile responsiveness",
				"Basic navigation",
			],
			polishTestingFocus: [
				"Prostota i jasność treści",
				"Dostępność wizualna",
				"Responsywność mobilna",
				"Podstawowa nawigacja",
			],
		},
		{
			id: "professional_medical",
			name: "Healthcare Professional",
			polishName: "Pracownik służby zdrowia",
			characteristics: [
				"Advanced medical knowledge",
				"Uses application for reference",
				"May work in clinical settings",
				"Desktop and tablet usage",
			],
			polishCharacteristics: [
				"Zaawansowana wiedza medyczna",
				"Używa aplikacji jako odniesienia",
				"Może pracować w warunkach klinicznych",
				"Używa komputerów i tabletów",
			],
			testingFocus: [
				"Medical terminology accuracy",
				"Evidence-based content",
				"Advanced search and filtering",
				"Professional terminology",
			],
			polishTestingFocus: [
				"Dokładność terminologii medycznej",
				"Treści oparte na dowodach",
				"Zaawansowane wyszukiwanie i filtrowanie",
				"Terminologia profesjonalna",
			],
		},
		{
			id: "general_public_senior",
			name: "Senior General Public",
			polishName: "Senior (ogół społeczeństwa)",
			characteristics: [
				"May have visual impairments",
				"May have motor impairments",
				"Limited technical skills",
				"Health-conscious but not expert",
			],
			polishCharacteristics: [
				"Może mieć problemy ze wzrokiem",
				"Może mieć problemy ruchowe",
				"Ograniczone umiejętności techniczne",
				"Świadomy zdrowia, ale nie ekspert",
			],
			testingFocus: [
				"High contrast mode",
				"Large text options",
				"Screen reader compatibility",
				"Simple, clear navigation",
			],
			polishTestingFocus: [
				"Tryb wysokiego kontrastu",
				"Opcje dużego tekstu",
				"Kompatybilność z czytnikami ekranu",
				"Prosta, jasna nawigacja",
			],
		},
	];

	generateManualTestingGuidelines(): string {
		let guidelines = `# Manual Accessibility Testing Guidelines for Suplementor App

## Overview
This document provides comprehensive manual testing guidelines for accessibility testing of the suplementor app's body systems content.

## User Profiles for Testing

`;

		this.userProfiles.forEach((profile) => {
			guidelines += `### ${profile.name} / ${profile.polishName}

**Characteristics / Charakterystyki:**
${profile.characteristics.map((char) => `- ${char}`).join("\n")}

**Testing Focus / Skupienie testowania:**
${profile.testingFocus.map((focus) => `- ${focus}`).join("\n")}

`;
		});

		guidelines += `
## Testing Procedures / Procedury testowania

### 1. Keyboard Navigation Testing / Testowanie nawigacji klawiaturą

#### Test Steps / Kroki testowania:
1. **Tab Order Verification / Weryfikacja kolejności tabulacji**
   - Navigate through all interactive elements using only the Tab key
   - Verify logical order and no elements are skipped
   - Test Shift+Tab for reverse navigation

2. **Arrow Key Navigation / Nawigacja strzałkami**
   - Test arrow key navigation in body system diagrams
   - Verify smooth movement between organs
   - Test camera controls with keyboard

3. **Keyboard Shortcuts / Skróty klawiaturowe**
   - Test all documented keyboard shortcuts
   - Verify help system shows correct shortcuts
   - Test accessibility of shortcut help

### 2. Screen Reader Testing / Testowanie czytników ekranu

#### Test Setup / Konfiguracja testu:
- Use multiple screen readers: NVDA (Windows), VoiceOver (Mac), TalkBack (Android)
- Test with different speech rates and voices
- Verify Polish language support

#### Test Steps / Kroki testowania:
1. **Content Announcement / Ogłaszanie treści**
   - Navigate through body systems and verify proper announcements
   - Test organ selection announcements
   - Verify supplement information is read correctly

2. **ARIA Labels / Etykiety ARIA**
   - Verify all interactive elements have proper ARIA labels
   - Test ARIA descriptions for complex elements
   - Check live region announcements

3. **Navigation Announcements / Ogłoszenia nawigacyjne**
   - Test page navigation announcements
   - Verify form submission announcements
   - Test error and success message announcements

### 3. Visual Accessibility Testing / Testowanie dostępności wizualnej

#### Test Steps / Kroki testowania:
1. **Color Contrast / Kontrast kolorów**
   - Test with high contrast mode enabled
   - Verify all text meets WCAG contrast requirements
   - Test with different color schemes

2. **Text Scaling / Skalowanie tekstu**
   - Test at 200% zoom level
   - Verify text remains readable and functional
   - Test with browser zoom and application zoom

3. **Visual Indicators / Wskaźniki wizualne**
   - Test focus indicators visibility
   - Verify hover states are clear
   - Test selection indicators

### 4. Mobile Accessibility Testing / Testowanie dostępności mobilnej

#### Test Steps / Kroki testowania:
1. **Touch Targets / Cele dotyku**
   - Verify all interactive elements are at least 44px
   - Test touch navigation with fingers
   - Verify no accidental activations

2. **Screen Reader Mobile / Czytnik ekranu mobilny**
   - Test with TalkBack (Android) and VoiceOver (iOS)
   - Verify gesture navigation works
   - Test with different screen sizes

3. **Responsive Design / Projekt responsywny**
   - Test across different mobile screen sizes
   - Verify content reflows properly
   - Test landscape and portrait orientations

### 5. Content Accessibility Testing / Testowanie dostępności treści

#### Test Steps / Kroki testowania:
1. **Reading Level / Poziom czytania**
   - Assess content complexity for different audiences
   - Verify medical terms are explained
   - Test content appropriateness for age groups

2. **Medical Terminology / Terminologia medyczna**
   - Identify complex medical terms
   - Verify definitions are provided
   - Test Polish translations accuracy

3. **Cultural Sensitivity / Wrażliwość kulturowa**
   - Review content for cultural appropriateness
   - Verify Polish translations are natural
   - Test for regional medical practices

## Testing Checklists / Listy kontrolne testowania

### Keyboard Accessibility Checklist / Lista kontrolna dostępności klawiatury
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and consistent
- [ ] Focus indicators are clearly visible
- [ ] Keyboard shortcuts work as documented
- [ ] Escape key closes modals and dialogs
- [ ] Enter/Space activates buttons and links

### Screen Reader Checklist / Lista kontrolna czytnika ekranu
- [ ] All images have appropriate alt text
- [ ] Form controls have proper labels
- [ ] Dynamic content changes are announced
- [ ] ARIA landmarks are properly used
- [ ] Headings create logical document outline
- [ ] Lists are marked up correctly

### Visual Accessibility Checklist / Lista kontrolna dostępności wizualnej
- [ ] Color contrast meets WCAG AA standards
- [ ] High contrast mode is available and functional
- [ ] Text scales properly up to 200%
- [ ] Focus indicators are visible and clear
- [ ] Information is not conveyed by color alone
- [ ] Visual elements have text alternatives

### Mobile Accessibility Checklist / Lista kontrolna dostępności mobilnej
- [ ] Touch targets are at least 44px
- [ ] Content is readable without horizontal scrolling
- [ ] Mobile screen readers work properly
- [ ] Gestures don't conflict with assistive technology
- [ ] Orientation changes are handled gracefully

## Reporting and Documentation / Raportowanie i dokumentacja

### Test Report Format / Format raportu testu
\`\`\`markdown
# Accessibility Test Report / Raport testu dostępności

**Test Date / Data testu:** [Date]
**Tester / Tester:** [Name]
**User Profile / Profil użytkownika:** [Profile]
**Device/Browser / Urządzenie/Przeglądarka:** [Details]

## Summary / Podsumowanie
[Overall assessment]

## Issues Found / Znalezione problemy
### Critical / Krytyczne
[Critical issues]

### High Priority / Wysoki priorytet
[High priority issues]

### Medium Priority / Średni priorytet
[Medium priority issues]

### Low Priority / Niski priorytet
[Low priority issues]

## Recommendations / Rekomendacje
[Improvement suggestions]

## Test Evidence / Dowody testu
[Screenshots, screen recordings, or detailed notes]
\`\`\`

## Tools and Resources / Narzędzia i zasoby

### Screen Readers / Czytniki ekranu
- NVDA (Free, Windows)
- JAWS (Commercial, Windows)
- VoiceOver (Built-in, macOS/iOS)
- TalkBack (Built-in, Android)

### Browser Extensions / Rozszerzenia przeglądarki
- axe DevTools
- WAVE Web Accessibility Evaluator
- Lighthouse Accessibility Audit
- Color Contrast Analyzer

### Testing Tools / Narzędzia testujące
- Keyboard navigation testing
- Screen reader testing scripts
- Automated accessibility testing
- Manual testing guidelines

## Best Practices / Najlepsze praktyki

1. **Test Early and Often / Testuj wcześnie i często**
   - Include accessibility testing in all development phases

2. **Test with Real Users / Testuj z prawdziwymi użytkownikami**
   - Include users with disabilities in testing process

3. **Document Everything / Dokumentuj wszystko**
   - Keep detailed records of all accessibility tests

4. **Stay Updated / Bądź na bieżąco**
   - Keep up with latest WCAG guidelines and best practices

5. **Automate Where Possible / Automatyzuj gdzie to możliwe**
   - Use automated tools to supplement manual testing

## Emergency Procedures / Procedury awaryjne

If critical accessibility issues are found that prevent users from accessing essential functionality:

1. Immediately notify the development team
2. Create alternative access methods if needed
3. Prioritize fixes based on impact and effort
4. Test fixes thoroughly before deployment
5. Document the incident and resolution

`;

		return guidelines;
	}

	generateUserSpecificGuidelines(userProfileId: string): string {
		const profile = this.userProfiles.find((p) => p.id === userProfileId);
		if (!profile) {
			throw new Error(`User profile ${userProfileId} not found`);
		}

		return `# Manual Testing Guidelines for ${profile.name}

## Profile Overview / Przegląd profilu
**Target Audience / Grupa docelowa:** ${profile.name}
**Polish Name / Nazwa polska:** ${profile.polishName}

## Characteristics / Charakterystyki
${profile.characteristics.map((char) => `- ${char}`).join("\n")}

## Testing Focus Areas / Obszary skupienia testowania
${profile.testingFocus.map((focus) => `- ${focus}`).join("\n")}

## Specific Test Scenarios / Szczegółowe scenariusze testów

### Scenario 1: Basic Navigation / Podstawowa nawigacja
1. Navigate to body systems page
2. Select a body system using keyboard only
3. Explore organs within the system
4. Access supplement information
5. Return to main page

**Expected Results / Oczekiwane wyniki:**
- All steps completable with keyboard only
- Screen reader announces all actions
- Visual feedback for selections
- No content skipped or inaccessible

### Scenario 2: Content Comprehension / Zrozumienie treści
1. Read descriptions of body systems
2. Understand organ functions
3. Comprehend supplement relationships
4. Follow cross-references between systems

**Expected Results / Oczekiwane wyniki:**
- Content appropriate for knowledge level
- Medical terms explained when needed
- Clear relationships between concepts
- Helpful navigation aids

### Scenario 3: Visual Accessibility / Dostępność wizualna
1. Enable high contrast mode
2. Test with 200% text scaling
3. Verify color contrast
4. Test with screen reader

**Expected Results / Oczekiwane wyniki:**
- All content visible in high contrast
- Text readable at high zoom levels
- Colors meet accessibility standards
- Screen reader provides full information

## Common Issues to Watch For / Typowe problemy do obserwacji

### For ${profile.name}:
${this.generateProfileSpecificIssues(profile)}

## Testing Checklist / Lista kontrolna testowania
${this.generateProfileSpecificChecklist(profile)}

## Success Criteria / Kryteria sukcesu
- User can complete all essential tasks independently
- No accessibility barriers prevent content access
- Content is appropriate for user's knowledge level
- All interactive elements work with assistive technology

`;
	}

	private generateProfileSpecificIssues(profile: any): string {
		const issues = [];

		if (profile.id === "student_basic") {
			issues.push(
				"Content too advanced for age group",
				"Medical terminology not explained",
				"Complex navigation patterns",
				"Small touch targets on mobile",
				"Unclear visual hierarchy",
			);
		} else if (profile.id === "professional_medical") {
			issues.push(
				"Inaccurate medical information",
				"Insufficient evidence citations",
				"Oversimplified content",
				"Missing advanced terminology",
				"Inadequate search functionality",
			);
		} else if (profile.id === "general_public_senior") {
			issues.push(
				"Small text or poor contrast",
				"Complex navigation menus",
				"Fast animations causing dizziness",
				"Touch targets too small",
				"Inadequate screen reader support",
			);
		}

		return issues.map((issue) => `- ${issue}`).join("\n");
	}

	private generateProfileSpecificChecklist(profile: any): string {
		const checklist = [];

		if (profile.id === "student_basic") {
			checklist.push(
				"- [ ] Content uses simple language",
				"- [ ] Medical terms are explained",
				"- [ ] Visual aids support understanding",
				"- [ ] Navigation is straightforward",
				"- [ ] Mobile interface is easy to use",
			);
		} else if (profile.id === "professional_medical") {
			checklist.push(
				"- [ ] Medical terminology is accurate",
				"- [ ] Evidence sources are cited",
				"- [ ] Advanced concepts are covered",
				"- [ ] Search functionality is comprehensive",
				"- [ ] Professional language is used",
			);
		} else if (profile.id === "general_public_senior") {
			checklist.push(
				"- [ ] High contrast mode works well",
				"- [ ] Text can be enlarged significantly",
				"- [ ] Screen reader support is complete",
				"- [ ] Touch targets are large enough",
				"- [ ] No time pressure for interactions",
			);
		}

		return checklist.join("\n");
	}
}

// Export singleton instances
export const manualTestingGuidelinesGenerator =
	new ManualTestingGuidelinesGenerator();

// Integration helper functions
export const integrateWithPlaywright = (
	config: PlaywrightAccessibilityConfig,
) => {
	return new PlaywrightAccessibilityIntegration(config);
};

export const integrateWithVitest = (config: VitestAccessibilityConfig) => {
	return new VitestAccessibilityIntegration(config);
};

// Main integration function
export const setupAccessibilityIntegration = async () => {
	console.log("🔧 Setting up accessibility integration...");

	// Initialize all accessibility systems
	await accessibilityTestingFramework.runComprehensiveAccessibilityAudit(
		bodySystems,
	);
	await contentValidationTools.validateMultipleSystems(bodySystems);

	// Set up reporting
	const dashboard = await accessibilityReportingSystem.generateDashboard();

	console.log("✅ Accessibility integration complete");
	console.log(`📊 Current compliance level: ${dashboard.currentCompliance}`);
	console.log(`🎯 Overall score: ${dashboard.overallScore}%`);
	console.log(`🚨 Active issues: ${dashboard.totalIssues}`);

	return {
		framework: accessibilityTestingFramework,
		testRunner: accessibilityTestRunner,
		validationTools: contentValidationTools,
		reportingSystem: accessibilityReportingSystem,
		dashboard,
	};
};
