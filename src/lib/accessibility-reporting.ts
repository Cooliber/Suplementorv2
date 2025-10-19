"use client";

/**
 * Accessibility Reporting and Remediation Tracking System
 * Provides comprehensive reporting and progress tracking for accessibility improvements
 */

import type {
	AccessibilityReport,
	AccessibilityTestResult,
	ContentAnalysisResult,
	ContentRecommendation,
} from "./accessibility-testing-framework";
import { contentValidationTools } from "./content-validation-tools";

export interface RemediationTask {
	id: string;
	title: string;
	polishTitle: string;
	description: string;
	polishDescription: string;
	priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	category: string;
	status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "BLOCKED";
	assignee?: string;
	estimatedHours: number;
	actualHours?: number;
	dueDate?: Date;
	createdDate: Date;
	updatedDate: Date;
	completedDate?: Date;
	relatedReports: string[];
	relatedContent: string[];
	wcagGuideline?: string;
	autoFixable: boolean;
	dependencies: string[];
	tags: string[];
	polishTags: string[];
}

export interface AccessibilityProgressReport {
	id: string;
	period: {
		startDate: Date;
		endDate: Date;
	};
	overallImprovement: number; // percentage
	totalIssues: number;
	resolvedIssues: number;
	newIssues: number;
	complianceLevel: "A" | "AA" | "AAA";
	previousComplianceLevel: "A" | "AA" | "AAA";
	topIssues: RemediationTask[];
	completedTasks: RemediationTask[];
	pendingTasks: RemediationTask[];
	blockedTasks: RemediationTask[];
	recommendations: string[];
	polishRecommendations: string[];
	nextSteps: string[];
	polishNextSteps: string[];
}

export interface AccessibilityDashboard {
	currentCompliance: "A" | "AA" | "AAA";
	overallScore: number;
	totalIssues: number;
	criticalIssues: number;
	highPriorityIssues: number;
	mediumPriorityIssues: number;
	lowPriorityIssues: number;
	recentReports: AccessibilityReport[];
	activeTasks: RemediationTask[];
	progressTrend: ProgressDataPoint[];
	upcomingDeadlines: RemediationTask[];
	quickActions: QuickAction[];
	polishQuickActions: QuickAction[];
}

export interface ProgressDataPoint {
	date: Date;
	score: number;
	issues: number;
	compliance: "A" | "AA" | "AAA";
}

export interface QuickAction {
	id: string;
	title: string;
	polishTitle: string;
	description: string;
	polishDescription: string;
	action: () => void;
	icon: string;
	variant: "primary" | "secondary" | "outline";
}

export class AccessibilityReportingSystem {
	private remediationTasks: Map<string, RemediationTask> = new Map();
	private progressHistory: ProgressDataPoint[] = [];
	private reports: AccessibilityReport[] = [];

	constructor() {
		this.initializeSystem();
	}

	private async initializeSystem(): Promise<void> {
		// Load existing data from localStorage or API
		await this.loadExistingData();

		// Set up periodic progress tracking
		this.setupProgressTracking();
	}

	private async loadExistingData(): Promise<void> {
		if (typeof localStorage === "undefined") return;

		try {
			const savedTasks = localStorage.getItem(
				"accessibility-remediation-tasks",
			);
			if (savedTasks) {
				const tasks = JSON.parse(savedTasks);
				tasks.forEach((task: RemediationTask) => {
					this.remediationTasks.set(task.id, {
						...task,
						createdDate: new Date(task.createdDate),
						updatedDate: new Date(task.updatedDate),
						dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
						completedDate: task.completedDate
							? new Date(task.completedDate)
							: undefined,
					});
				});
			}

			const savedReports = localStorage.getItem("accessibility-reports");
			if (savedReports) {
				const reports = JSON.parse(savedReports);
				this.reports = reports.map((report: AccessibilityReport) => ({
					...report,
					timestamp: new Date(report.timestamp),
				}));
			}
		} catch (error) {
			console.warn("Failed to load accessibility data:", error);
		}
	}

	private setupProgressTracking(): void {
		// Track progress daily
		const trackProgress = () => {
			const currentProgress = this.calculateCurrentProgress();
			this.progressHistory.push(currentProgress);

			// Keep only last 30 days
			if (this.progressHistory.length > 30) {
				this.progressHistory = this.progressHistory.slice(-30);
			}

			// Save to localStorage
			if (typeof localStorage !== "undefined") {
				localStorage.setItem(
					"accessibility-progress-history",
					JSON.stringify(this.progressHistory),
				);
			}
		};

		// Track immediately and then daily
		trackProgress();
		setInterval(trackProgress, 24 * 60 * 60 * 1000); // Daily
	}

	private calculateCurrentProgress(): ProgressDataPoint {
		const activeTasks = Array.from(this.remediationTasks.values()).filter(
			(task) => task.status === "COMPLETED",
		);

		const totalTasks = this.remediationTasks.size;
		const completedTasks = activeTasks.length;

		const score =
			totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

		// Determine compliance level based on remaining critical issues
		const criticalIssues = Array.from(this.remediationTasks.values()).filter(
			(task) => task.priority === "CRITICAL" && task.status !== "COMPLETED",
		);

		let compliance: "A" | "AA" | "AAA" = "AAA";
		if (criticalIssues.length > 0) {
			compliance = "AA";
		}
		if (criticalIssues.length > 2) {
			compliance = "A";
		}

		return {
			date: new Date(),
			score,
			issues: this.remediationTasks.size - completedTasks,
			compliance,
		};
	}

	// Generate remediation tasks from accessibility reports
	async generateRemediationTasks(
		reports: AccessibilityReport[],
		contentAnalyses: ContentAnalysisResult[],
	): Promise<RemediationTask[]> {
		const tasks: RemediationTask[] = [];

		// Process accessibility test results
		reports.forEach((report) => {
			report.results.forEach((result) => {
				if (result.status !== "PASS") {
					const task = this.createTaskFromTestResult(result, report.id);
					tasks.push(task);
				}
			});
		});

		// Process content analysis recommendations
		contentAnalyses.forEach((analysis) => {
			analysis.recommendations.forEach((recommendation) => {
				const task = this.createTaskFromRecommendation(
					recommendation,
					analysis,
				);
				tasks.push(task);
			});
		});

		// Add tasks to system
		tasks.forEach((task) => {
			this.remediationTasks.set(task.id, task);
		});

		// Save to localStorage
		await this.saveTasks();

		return tasks;
	}

	private createTaskFromTestResult(
		result: AccessibilityTestResult,
		reportId: string,
	): RemediationTask {
		const priority = this.mapSeverityToPriority(result.severity);
		const estimatedHours = this.estimateTaskEffort(result);

		return {
			id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			title: `Fix ${result.testName}`,
			polishTitle: `Napraw ${result.testName}`,
			description: result.suggestion || result.description,
			polishDescription: result.polishSuggestion || result.polishDescription,
			priority,
			category: result.category,
			status: "PENDING",
			estimatedHours,
			createdDate: new Date(),
			updatedDate: new Date(),
			relatedReports: [reportId],
			relatedContent: result.element ? [result.element] : [],
			wcagGuideline: result.wcagGuideline,
			autoFixable: result.autoFixable,
			dependencies: [],
			tags: [result.category, priority],
			polishTags: [result.category, priority],
		};
	}

	private createTaskFromRecommendation(
		recommendation: ContentRecommendation,
		analysis: ContentAnalysisResult,
	): RemediationTask {
		const priority = recommendation.priority;
		const estimatedHours = recommendation.estimatedEffort / 60; // Convert minutes to hours

		return {
			id: `content_task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			title: recommendation.description,
			polishTitle: recommendation.polishDescription,
			description: recommendation.description,
			polishDescription: recommendation.polishDescription,
			priority,
			category: recommendation.type,
			status: "PENDING",
			estimatedHours,
			createdDate: new Date(),
			updatedDate: new Date(),
			relatedReports: [],
			relatedContent: [analysis.contentId],
			autoFixable: recommendation.autoFixable,
			dependencies: [],
			tags: [recommendation.type, priority],
			polishTags: [recommendation.type, priority],
		};
	}

	private mapSeverityToPriority(
		severity: string,
	): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
		switch (severity) {
			case "CRITICAL":
				return "CRITICAL";
			case "HIGH":
				return "HIGH";
			case "MEDIUM":
				return "MEDIUM";
			case "LOW":
				return "LOW";
			default:
				return "MEDIUM";
		}
	}

	private estimateTaskEffort(result: AccessibilityTestResult): number {
		// Estimate effort based on test category and severity
		const baseEffort: Record<string, number> = {
			KEYBOARD_NAVIGATION: 2,
			SCREEN_READER: 3,
			VISUAL_DESIGN: 1,
			CONTENT_ACCESSIBILITY: 2,
			MOBILE_ACCESSIBILITY: 2,
			COGNITIVE_ACCESSIBILITY: 3,
			MOTOR_ACCESSIBILITY: 2,
			CULTURAL_ACCESSIBILITY: 2,
			AGE_ACCESSIBILITY: 2,
			MEDICAL_ACCURACY: 4,
		};

		const categoryEffort = baseEffort[result.category] || 2;

		// Adjust based on severity
		const severityMultiplier = {
			CRITICAL: 2,
			HIGH: 1.5,
			MEDIUM: 1,
			LOW: 0.5,
		};

		return categoryEffort * (severityMultiplier[result.severity] || 1);
	}

	// Generate comprehensive progress report
	async generateProgressReport(
		startDate: Date,
		endDate: Date,
	): Promise<AccessibilityProgressReport> {
		const periodTasks = Array.from(this.remediationTasks.values()).filter(
			(task) => task.createdDate >= startDate && task.createdDate <= endDate,
		);

		const completedTasks = periodTasks.filter(
			(task) => task.status === "COMPLETED",
		);
		const pendingTasks = periodTasks.filter(
			(task) => task.status === "PENDING",
		);
		const blockedTasks = periodTasks.filter(
			(task) => task.status === "BLOCKED",
		);

		// Calculate improvement
		const startProgress = this.getProgressAtDate(startDate);
		const endProgress = this.getProgressAtDate(endDate);
		const overallImprovement = endProgress.score - startProgress.score;

		// Get top issues (critical and high priority pending tasks)
		const topIssues = Array.from(this.remediationTasks.values())
			.filter(
				(task) =>
					(task.priority === "CRITICAL" || task.priority === "HIGH") &&
					task.status === "PENDING",
			)
			.sort(
				(a, b) =>
					this.getPriorityWeight(b.priority) -
					this.getPriorityWeight(a.priority),
			)
			.slice(0, 10);

		const recommendations = this.generateProgressRecommendations(
			completedTasks,
			pendingTasks,
			blockedTasks,
		);
		const polishRecommendations = this.generatePolishProgressRecommendations(
			completedTasks,
			pendingTasks,
			blockedTasks,
		);

		const nextSteps = this.generateNextSteps(pendingTasks, blockedTasks);
		const polishNextSteps = this.generatePolishNextSteps(
			pendingTasks,
			blockedTasks,
		);

		return {
			id: `progress_${Date.now()}`,
			period: { startDate, endDate },
			overallImprovement,
			totalIssues: periodTasks.length,
			resolvedIssues: completedTasks.length,
			newIssues: periodTasks.length - completedTasks.length,
			complianceLevel: endProgress.compliance,
			previousComplianceLevel: startProgress.compliance,
			topIssues,
			completedTasks,
			pendingTasks,
			blockedTasks,
			recommendations,
			polishRecommendations,
			nextSteps,
			polishNextSteps,
		};
	}

	private getProgressAtDate(date: Date): ProgressDataPoint {
		// Find the closest progress data point to the given date
		const relevantPoints = this.progressHistory.filter(
			(point) => point.date <= date,
		);

		if (relevantPoints.length === 0) {
			return {
				date,
				score: 0,
				issues: this.remediationTasks.size,
				compliance: "A",
			};
		}

		return relevantPoints[relevantPoints.length - 1];
	}

	private getPriorityWeight(priority: string): number {
		switch (priority) {
			case "CRITICAL":
				return 4;
			case "HIGH":
				return 3;
			case "MEDIUM":
				return 2;
			case "LOW":
				return 1;
			default:
				return 0;
		}
	}

	private generateProgressRecommendations(
		completedTasks: RemediationTask[],
		pendingTasks: RemediationTask[],
		blockedTasks: RemediationTask[],
	): string[] {
		const recommendations: string[] = [];

		if (completedTasks.length > 0) {
			recommendations.push(
				`Great progress! ${completedTasks.length} tasks completed this period.`,
			);
		}

		if (pendingTasks.length > 10) {
			recommendations.push(
				"Focus on reducing the number of pending tasks by prioritizing critical issues.",
			);
		}

		if (blockedTasks.length > 0) {
			recommendations.push(
				`Address ${blockedTasks.length} blocked tasks to maintain progress momentum.`,
			);
		}

		const criticalTasks = pendingTasks.filter(
			(task) => task.priority === "CRITICAL",
		);
		if (criticalTasks.length > 0) {
			recommendations.push(
				`Prioritize ${criticalTasks.length} critical tasks for immediate attention.`,
			);
		}

		return recommendations;
	}

	private generatePolishProgressRecommendations(
		completedTasks: RemediationTask[],
		pendingTasks: RemediationTask[],
		blockedTasks: RemediationTask[],
	): string[] {
		const recommendations: string[] = [];

		if (completedTasks.length > 0) {
			recommendations.push(
				`Świetny postęp! ${completedTasks.length} zadań ukończonych w tym okresie.`,
			);
		}

		if (pendingTasks.length > 10) {
			recommendations.push(
				"Skoncentruj się na redukcji liczby oczekujących zadań poprzez priorytetyzację problemów krytycznych.",
			);
		}

		if (blockedTasks.length > 0) {
			recommendations.push(
				`Rozwiąż ${blockedTasks.length} zablokowanych zadań, aby utrzymać tempo postępu.`,
			);
		}

		const criticalTasks = pendingTasks.filter(
			(task) => task.priority === "CRITICAL",
		);
		if (criticalTasks.length > 0) {
			recommendations.push(
				`Priorytetyzuj ${criticalTasks.length} zadań krytycznych do natychmiastowej uwagi.`,
			);
		}

		return recommendations;
	}

	private generateNextSteps(
		pendingTasks: RemediationTask[],
		blockedTasks: RemediationTask[],
	): string[] {
		const nextSteps: string[] = [];

		// Group tasks by priority
		const criticalTasks = pendingTasks.filter(
			(task) => task.priority === "CRITICAL",
		);
		const highTasks = pendingTasks.filter((task) => task.priority === "HIGH");

		if (criticalTasks.length > 0) {
			nextSteps.push(
				`Complete ${criticalTasks.length} critical accessibility tasks`,
			);
		}

		if (highTasks.length > 0) {
			nextSteps.push(
				`Address ${highTasks.length} high-priority accessibility issues`,
			);
		}

		if (blockedTasks.length > 0) {
			nextSteps.push(
				`Resolve dependencies for ${blockedTasks.length} blocked tasks`,
			);
		}

		// Add automation opportunities
		const autoFixableTasks = pendingTasks.filter((task) => task.autoFixable);
		if (autoFixableTasks.length > 0) {
			nextSteps.push(
				`Automate ${autoFixableTasks.length} fixable accessibility issues`,
			);
		}

		return nextSteps;
	}

	private generatePolishNextSteps(
		pendingTasks: RemediationTask[],
		blockedTasks: RemediationTask[],
	): string[] {
		const nextSteps: string[] = [];

		// Group tasks by priority
		const criticalTasks = pendingTasks.filter(
			(task) => task.priority === "CRITICAL",
		);
		const highTasks = pendingTasks.filter((task) => task.priority === "HIGH");

		if (criticalTasks.length > 0) {
			nextSteps.push(
				`Ukończ ${criticalTasks.length} krytycznych zadań dostępności`,
			);
		}

		if (highTasks.length > 0) {
			nextSteps.push(
				`Rozwiąż ${highTasks.length} problemów dostępności wysokiego priorytetu`,
			);
		}

		if (blockedTasks.length > 0) {
			nextSteps.push(
				`Rozwiąż zależności dla ${blockedTasks.length} zablokowanych zadań`,
			);
		}

		// Add automation opportunities
		const autoFixableTasks = pendingTasks.filter((task) => task.autoFixable);
		if (autoFixableTasks.length > 0) {
			nextSteps.push(
				`Zautomatyzuj ${autoFixableTasks.length} naprawialnych problemów dostępności`,
			);
		}

		return nextSteps;
	}

	// Generate accessibility dashboard
	async generateDashboard(): Promise<AccessibilityDashboard> {
		const currentProgress = this.calculateCurrentProgress();
		const activeTasks = Array.from(this.remediationTasks.values()).filter(
			(task) => task.status === "PENDING" || task.status === "IN_PROGRESS",
		);

		const criticalIssues = activeTasks.filter(
			(task) => task.priority === "CRITICAL",
		).length;
		const highPriorityIssues = activeTasks.filter(
			(task) => task.priority === "HIGH",
		).length;
		const mediumPriorityIssues = activeTasks.filter(
			(task) => task.priority === "MEDIUM",
		).length;
		const lowPriorityIssues = activeTasks.filter(
			(task) => task.priority === "LOW",
		).length;

		const recentReports = this.reports
			.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
			.slice(0, 5);

		const upcomingDeadlines = Array.from(this.remediationTasks.values())
			.filter(
				(task) =>
					task.dueDate &&
					task.dueDate > new Date() &&
					task.status !== "COMPLETED",
			)
			.sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
			.slice(0, 5);

		const quickActions = this.generateQuickActions();
		const polishQuickActions = this.generatePolishQuickActions();

		return {
			currentCompliance: currentProgress.compliance,
			overallScore: currentProgress.score,
			totalIssues: activeTasks.length,
			criticalIssues,
			highPriorityIssues,
			mediumPriorityIssues,
			lowPriorityIssues,
			recentReports,
			activeTasks,
			progressTrend: this.progressHistory.slice(-7), // Last 7 days
			upcomingDeadlines,
			quickActions,
			polishQuickActions,
		};
	}

	private generateQuickActions(): QuickAction[] {
		return [
			{
				id: "run-accessibility-audit",
				title: "Run Accessibility Audit",
				polishTitle: "Uruchom audyt dostępności",
				description:
					"Run a comprehensive accessibility audit on all body systems",
				polishDescription:
					"Uruchom kompleksowy audyt dostępności wszystkich układów ciała",
				action: () => {
					// This would trigger the accessibility audit
					console.log("Running accessibility audit...");
				},
				icon: "search",
				variant: "primary",
			},
			{
				id: "fix-critical-issues",
				title: "Fix Critical Issues",
				polishTitle: "Napraw problemy krytyczne",
				description: "Focus on resolving critical accessibility issues",
				polishDescription:
					"Skoncentruj się na rozwiązywaniu krytycznych problemów dostępności",
				action: () => {
					// This would filter and show critical issues
					console.log("Showing critical issues...");
				},
				icon: "alert-triangle",
				variant: "primary",
			},
			{
				id: "generate-report",
				title: "Generate Report",
				polishTitle: "Generuj raport",
				description: "Create a comprehensive accessibility progress report",
				polishDescription: "Utwórz kompleksowy raport postępu dostępności",
				action: () => {
					// This would generate a progress report
					console.log("Generating progress report...");
				},
				icon: "file-text",
				variant: "secondary",
			},
		];
	}

	private generatePolishQuickActions(): QuickAction[] {
		return [
			{
				id: "run-accessibility-audit",
				title: "Uruchom audyt dostępności",
				polishTitle: "Uruchom audyt dostępności",
				description:
					"Uruchom kompleksowy audyt dostępności wszystkich układów ciała",
				polishDescription:
					"Uruchom kompleksowy audyt dostępności wszystkich układów ciała",
				action: () => {
					console.log("Running accessibility audit...");
				},
				icon: "search",
				variant: "primary",
			},
			{
				id: "fix-critical-issues",
				title: "Napraw problemy krytyczne",
				polishTitle: "Napraw problemy krytyczne",
				description:
					"Skoncentruj się na rozwiązywaniu krytycznych problemów dostępności",
				polishDescription:
					"Skoncentruj się na rozwiązywaniu krytycznych problemów dostępności",
				action: () => {
					console.log("Showing critical issues...");
				},
				icon: "alert-triangle",
				variant: "primary",
			},
			{
				id: "generate-report",
				title: "Generuj raport",
				polishTitle: "Generuj raport",
				description: "Utwórz kompleksowy raport postępu dostępności",
				polishDescription: "Utwórz kompleksowy raport postępu dostępności",
				action: () => {
					console.log("Generating progress report...");
				},
				icon: "file-text",
				variant: "secondary",
			},
		];
	}

	// Task management methods
	async updateTaskStatus(
		taskId: string,
		status: RemediationTask["status"],
		actualHours?: number,
	): Promise<void> {
		const task = this.remediationTasks.get(taskId);
		if (!task) {
			throw new Error(`Task ${taskId} not found`);
		}

		task.status = status;
		task.updatedDate = new Date();

		if (status === "COMPLETED") {
			task.completedDate = new Date();
			if (actualHours) {
				task.actualHours = actualHours;
			}
		}

		await this.saveTasks();
	}

	async assignTask(taskId: string, assignee: string): Promise<void> {
		const task = this.remediationTasks.get(taskId);
		if (!task) {
			throw new Error(`Task ${taskId} not found`);
		}

		task.assignee = assignee;
		task.updatedDate = new Date();
		await this.saveTasks();
	}

	async setTaskDueDate(taskId: string, dueDate: Date): Promise<void> {
		const task = this.remediationTasks.get(taskId);
		if (!task) {
			throw new Error(`Task ${taskId} not found`);
		}

		task.dueDate = dueDate;
		task.updatedDate = new Date();
		await this.saveTasks();
	}

	// Data persistence
	private async saveTasks(): Promise<void> {
		if (typeof localStorage === "undefined") return;

		try {
			const tasksArray = Array.from(this.remediationTasks.values());
			localStorage.setItem(
				"accessibility-remediation-tasks",
				JSON.stringify(tasksArray),
			);
		} catch (error) {
			console.warn("Failed to save remediation tasks:", error);
		}
	}

	private async saveReports(): Promise<void> {
		if (typeof localStorage === "undefined") return;

		try {
			localStorage.setItem(
				"accessibility-reports",
				JSON.stringify(this.reports),
			);
		} catch (error) {
			console.warn("Failed to save reports:", error);
		}
	}

	// Public methods for external access
	getAllTasks(): RemediationTask[] {
		return Array.from(this.remediationTasks.values());
	}

	getTasksByStatus(status: RemediationTask["status"]): RemediationTask[] {
		return Array.from(this.remediationTasks.values()).filter(
			(task) => task.status === status,
		);
	}

	getTasksByPriority(priority: RemediationTask["priority"]): RemediationTask[] {
		return Array.from(this.remediationTasks.values()).filter(
			(task) => task.priority === priority,
		);
	}

	getOverdueTasks(): RemediationTask[] {
		const now = new Date();
		return Array.from(this.remediationTasks.values()).filter(
			(task) =>
				task.dueDate && task.dueDate < now && task.status !== "COMPLETED",
		);
	}

	getProgressHistory(): ProgressDataPoint[] {
		return [...this.progressHistory];
	}

	async addReport(report: AccessibilityReport): Promise<void> {
		this.reports.push(report);
		await this.saveReports();
	}

	// Export functionality
	async exportReport(format: "JSON" | "CSV" | "PDF" = "JSON"): Promise<string> {
		const dashboard = await this.generateDashboard();

		switch (format) {
			case "JSON":
				return JSON.stringify(dashboard, null, 2);
			case "CSV":
				return this.convertToCSV(dashboard);
			case "PDF":
				// In a real implementation, this would generate a PDF
				return `PDF export not implemented yet. Dashboard data: ${JSON.stringify(dashboard)}`;
			default:
				return JSON.stringify(dashboard, null, 2);
		}
	}

	private convertToCSV(dashboard: AccessibilityDashboard): string {
		const headers = ["Metric", "Value"];

		const rows = [
			["Current Compliance", dashboard.currentCompliance],
			["Overall Score", dashboard.overallScore.toString()],
			["Total Issues", dashboard.totalIssues.toString()],
			["Critical Issues", dashboard.criticalIssues.toString()],
			["High Priority Issues", dashboard.highPriorityIssues.toString()],
			["Medium Priority Issues", dashboard.mediumPriorityIssues.toString()],
			["Low Priority Issues", dashboard.lowPriorityIssues.toString()],
		];

		return [headers, ...rows].map((row) => row.join(",")).join("\n");
	}
}

// Export singleton instance
export const accessibilityReportingSystem = new AccessibilityReportingSystem();
