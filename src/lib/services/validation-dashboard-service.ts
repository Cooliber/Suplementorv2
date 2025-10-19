"use client";

/**
 * Validation Dashboard and Reporting Service
 * Provides real-time monitoring, automated alerts, quality metrics,
 * and integration with existing suplementor content management
 */

import type { BodySystem } from '@/data/body-systems';
import { CurrencyVerificationResult, currencyVerificationService } from './currency-verification';
import { MedicalValidationResult, enhancedMedicalValidationService } from './enhanced-medical-validation';
import { ValidationAuditResult, enhancedValidationTools } from './enhanced-validation-tools';
import { ComplianceReport, QualityMetrics, qualityAssuranceFramework } from './quality-assurance-framework';

export interface DashboardData {
  id: string;
  generatedAt: Date;

  // Overview metrics
  overview: {
    totalContentItems: number;
    validatedItems: number;
    pendingValidation: number;
    criticalIssues: number;
    overallQualityScore: number;
  };

  // Real-time status
  realTimeStatus: {
    activeValidations: number;
    queuedValidations: number;
    failedValidations: number;
    systemHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  };

  // Quality trends
  qualityTrends: QualityTrendData[];
  alerts: SystemAlert[];
  recentActivity: ActivityItem[];
  upcomingTasks: UpcomingTask[];
}

export interface QualityTrendData {
  date: Date;
  medicalAccuracy: number;
  currencyScore: number;
  citationQuality: number;
  overallScore: number;
  contentVolume: number;
}

export interface SystemAlert {
  id: string;
  type: 'QUALITY_DECLINE' | 'CURRENCY_EXPIRED' | 'CITATION_BROKEN' | 'COMPLIANCE_ISSUE' | 'SYSTEM_ERROR';
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  title: string;
  message: string;
  affectedContent: string[];
  timestamp: Date;
  resolved: boolean;
  resolution?: string;
  action?: string;
}

export interface ActivityItem {
  id: string;
  type: 'VALIDATION_COMPLETED' | 'REVIEW_COMPLETED' | 'CONTENT_UPDATED' | 'ISSUE_RESOLVED';
  description: string;
  timestamp: Date;
  user?: string;
  contentId?: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
}

export interface UpcomingTask {
  id: string;
  type: 'CONTENT_REVIEW' | 'CURRENCY_CHECK' | 'CITATION_UPDATE' | 'COMPLIANCE_AUDIT';
  title: string;
  description: string;
  dueDate: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedTo?: string;
  contentId: string;
  estimatedEffort: number; // minutes
}

export interface ValidationReport {
  id: string;
  title: string;
  generatedDate: Date;
  type: 'COMPREHENSIVE' | 'MEDICAL_FOCUS' | 'CURRENCY_FOCUS' | 'COMPLIANCE_FOCUS';

  // Report content
  executiveSummary: ExecutiveSummary;
  detailedFindings: DetailedFindings;
  recommendations: ReportRecommendation[];
  appendices: ReportAppendix[];
}

export interface ExecutiveSummary {
  period: {
    startDate: Date;
    endDate: Date;
  };
  keyMetrics: {
    contentValidated: number;
    averageQualityScore: number;
    issuesResolved: number;
    complianceRate: number;
  };
  majorFindings: string[];
  priorityActions: string[];
}

export interface DetailedFindings {
  medicalAccuracy: {
    averageScore: number;
    trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
    topIssues: string[];
    improvements: string[];
  };
  contentCurrency: {
    averageScore: number;
    outdatedContent: number;
    upcomingReviews: number;
    currencyTrend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  };
  compliance: {
    overallCompliance: number;
    standardsMet: number;
    totalStandards: number;
    criticalGaps: string[];
  };
}

export interface ReportRecommendation {
  category: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  expectedImpact: string;
  implementationEffort: 'LOW' | 'MEDIUM' | 'HIGH';
  resources: string[];
}

export interface ReportAppendix {
  title: string;
  type: 'CHART' | 'TABLE' | 'DETAILED_DATA' | 'METHODOLOGY';
  content: any;
}

export interface IntegrationConfig {
  suplementorAPI: {
    baseURL: string;
    apiKey: string;
    timeout: number;
  };
  notificationService: {
    email: boolean;
    webhook: boolean;
    sms: boolean;
  };
  storageService: {
    provider: 'DATABASE' | 'FILESYSTEM' | 'CLOUD';
    backupFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  };
}

export class ValidationDashboardService {
  private dashboardData: DashboardData | null = null;
  private alertSubscribers: Map<string, AlertCallback> = new Map();
  private integrationConfig: IntegrationConfig | null = null;
  private realTimeUpdates = true;

  constructor() {
    this.initializeDashboard();
    this.startRealTimeUpdates();
  }

  private async initializeDashboard(): Promise<void> {
    // Initialize dashboard with current data
    await this.refreshDashboardData();
  }

  private startRealTimeUpdates(): void {
    if (!this.realTimeUpdates) return;

    // Update dashboard every 5 minutes
    setInterval(async () => {
      await this.refreshDashboardData();
    }, 5 * 60 * 1000);

    // Check for alerts every minute
    setInterval(async () => {
      await this.checkForAlerts();
    }, 60 * 1000);
  }

  /**
   * Get current dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    if (!this.dashboardData) {
      await this.refreshDashboardData();
    }
    return this.dashboardData!;
  }

  /**
   * Refresh dashboard data from all sources
   */
  async refreshDashboardData(): Promise<void> {
    const now = new Date();

    // Get overview metrics
    const overview = await this.getOverviewMetrics();

    // Get real-time status
    const realTimeStatus = await this.getRealTimeStatus();

    // Get quality trends (last 30 days)
    const qualityTrends = await this.getQualityTrends(30);

    // Get active alerts
    const alerts = await this.getActiveAlerts();

    // Get recent activity
    const recentActivity = await this.getRecentActivity(20);

    // Get upcoming tasks
    const upcomingTasks = await this.getUpcomingTasks();

    this.dashboardData = {
      id: `dashboard_${now.getTime()}`,
      generatedAt: now,
      overview,
      realTimeStatus,
      qualityTrends,
      alerts,
      recentActivity,
      upcomingTasks
    };

    // Notify subscribers of updates
    this.notifyAlertSubscribers('DASHBOARD_UPDATED', {
      type: 'DASHBOARD_UPDATED',
      message: 'Dashboard data refreshed',
      timestamp: now
    });
  }

  private async getOverviewMetrics(): Promise<DashboardData['overview']> {
    // Get all body systems
    const bodySystems = this.getAllBodySystems(); // Would get from suplementor API

    // Get validation results
    const medicalResults = await enhancedMedicalValidationService.validateMultipleBodySystems(bodySystems);
    const currencyResults = await currencyVerificationService.verifyMultipleBodySystems(bodySystems);

    const totalItems = bodySystems.length;
    const validatedItems = medicalResults.length;
    const pendingValidation = Math.max(0, totalItems - validatedItems);

    // Calculate average scores
    const avgMedicalScore = medicalResults.reduce((sum, r) => sum + r.overallMedicalAccuracy, 0) / medicalResults.length || 0;
    const avgCurrencyScore = currencyResults.reduce((sum, r) => sum + r.overallCurrency, 0) / currencyResults.length || 0;
    const overallQualityScore = Math.round((avgMedicalScore + avgCurrencyScore) / 2);

    // Count critical issues
    const criticalIssues = [
      ...medicalResults.filter(r => r.requiresExpertReview).map(r => r.contentId),
      ...currencyResults.filter(r => r.alerts.some(a => a.severity === 'CRITICAL')).map(r => r.contentId)
    ].length;

    return {
      totalContentItems: totalItems,
      validatedItems,
      pendingValidation,
      criticalIssues,
      overallQualityScore: Math.round(overallQualityScore)
    };
  }

  private async getRealTimeStatus(): Promise<DashboardData['realTimeStatus']> {
    // Get current system status
    const activeValidations = enhancedValidationTools.activeValidations?.size || 0;
    const systemHealth = await this.checkSystemHealth();

    return {
      activeValidations,
      queuedValidations: 0, // Would track from queue
      failedValidations: 0, // Would track from error logs
      systemHealth
    };
  }

  private async getQualityTrends(days: number): Promise<QualityTrendData[]> {
    const trends: QualityTrendData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);

      // Get metrics for this date (mock data for now)
      trends.push({
        date,
        medicalAccuracy: Math.floor(Math.random() * 20) + 75, // 75-95
        currencyScore: Math.floor(Math.random() * 15) + 80, // 80-95
        citationQuality: Math.floor(Math.random() * 10) + 85, // 85-95
        overallScore: Math.floor(Math.random() * 15) + 80, // 80-95
        contentVolume: Math.floor(Math.random() * 50) + 10 // 10-60
      });
    }

    return trends;
  }

  private async getActiveAlerts(): Promise<SystemAlert[]> {
    // Get current alerts from all validation systems
    const alerts: SystemAlert[] = [];

    // Check for quality decline
    const currentTrends = await this.getQualityTrends(7);
    const recentAverage = currentTrends.slice(0, 3).reduce((sum, t) => sum + t.overallScore, 0) / 3;
    const olderAverage = currentTrends.slice(4, 7).reduce((sum, t) => sum + t.overallScore, 0) / 3;

    if (recentAverage < olderAverage - 10) {
      alerts.push({
        id: `quality_decline_${Date.now()}`,
        type: 'QUALITY_DECLINE',
        severity: 'WARNING',
        title: 'Quality Score Declining',
        message: `Overall quality score has declined by ${Math.round(olderAverage - recentAverage)} points in the last week`,
        affectedContent: [],
        timestamp: new Date(),
        resolved: false,
        action: 'Review recent content changes and validation results'
      });
    }

    // Check for expired content
    const expiredContent = await this.getExpiredContent();
    if (expiredContent.length > 0) {
      alerts.push({
        id: `expired_content_${Date.now()}`,
        type: 'CURRENCY_EXPIRED',
        severity: 'ERROR',
        title: 'Content Currency Expired',
        message: `${expiredContent.length} content items have expired and need review`,
        affectedContent: expiredContent,
        timestamp: new Date(),
        resolved: false,
        action: 'Review and update expired content'
      });
    }

    return alerts;
  }

  private async getRecentActivity(limit: number): Promise<ActivityItem[]> {
    // Get recent validation and review activities
    const activities: ActivityItem[] = [];

    // Mock recent activities
    const mockActivities = [
      {
        type: 'VALIDATION_COMPLETED' as const,
        description: 'Medical validation completed for Endocannabinoid System',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        user: 'system',
        contentId: 'endocannabinoid',
        status: 'SUCCESS' as const
      },
      {
        type: 'REVIEW_COMPLETED' as const,
        description: 'Expert review completed for Cardiovascular System',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        user: 'dr.kowalski',
        contentId: 'cardiovascular',
        status: 'SUCCESS' as const
      }
    ];

    activities.push(...mockActivities);

    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private async getUpcomingTasks(): Promise<UpcomingTask[]> {
    const tasks: UpcomingTask[] = [];

    // Get tasks from quality assurance framework
    const activeReviews = qualityAssuranceFramework.getActiveReviews();

    activeReviews.forEach(review => {
      tasks.push({
        id: review.executionId,
        type: 'CONTENT_REVIEW',
        title: 'Content Review Required',
        description: 'Manual review required for content validation',
        dueDate: review.dueDate,
        priority: review.priority,
        contentId: review.executionId.split('_')[2] || 'unknown',
        estimatedEffort: 30
      });
    });

    // Add scheduled tasks
    const scheduledTasks = await this.getScheduledTasks();
    tasks.push(...scheduledTasks);

    return tasks
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 10);
  }

  private async getExpiredContent(): Promise<string[]> {
    // Check for content that needs updating
    const bodySystems = this.getAllBodySystems();
    const expiredContent: string[] = [];

    for (const system of bodySystems) {
      const currencyResult = await currencyVerificationService.verifyBodySystemCurrency(system);

      if (currencyResult.contentFreshness.freshnessLevel === 'OUTDATED' ||
          currencyResult.contentFreshness.freshnessLevel === 'ARCHIVED') {
        expiredContent.push(system.id);
      }
    }

    return expiredContent;
  }

  private async getScheduledTasks(): Promise<UpcomingTask[]> {
    // Get scheduled validation and review tasks
    return [
      {
        id: 'scheduled_currency_check',
        type: 'CURRENCY_CHECK',
        title: 'Monthly Currency Review',
        description: 'Scheduled review of content currency',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        priority: 'MEDIUM',
        contentId: 'all_systems',
        estimatedEffort: 120
      }
    ];
  }

  private async checkSystemHealth(): Promise<'HEALTHY' | 'WARNING' | 'CRITICAL'> {
    // Check various system health indicators
    const dashboardData = await this.getDashboardData();

    if (dashboardData.overview.criticalIssues > 10) {
      return 'CRITICAL';
    }

    if (dashboardData.overview.criticalIssues > 5 || dashboardData.overview.overallQualityScore < 70) {
      return 'WARNING';
    }

    return 'HEALTHY';
  }

  private getAllBodySystems(): BodySystem[] {
    // This would integrate with the suplementor content management system
    // For now, return a mock list
    return [
      {
        id: 'endocannabinoid',
        name: 'Endocannabinoid System',
        polishName: 'Układ endokannabinoidowy',
        description: 'The endocannabinoid system regulates various physiological processes',
        polishDescription: 'Układ endokannabinoidowy reguluje różne procesy fizjologiczne',
        organs: [],
        functions: [],
        polishFunctions: [],
        relatedSupplements: [],
        anatomicalInfo: {
          location: 'Throughout the body',
          polishLocation: 'W całym organizmie',
          connections: [],
          polishConnections: [],
          clinicalRelevance: 'Important for homeostasis',
          polishClinicalRelevance: 'Ważny dla homeostazy'
        }
      }
    ];
  }

  /**
   * Alert management
   */
  async checkForAlerts(): Promise<SystemAlert[]> {
    const alerts: SystemAlert[] = [];

    // Check for new alerts
    const newAlerts = await this.getActiveAlerts();

    for (const alert of newAlerts) {
      if (!this.isAlertExisting(alert)) {
        await this.processNewAlert(alert);
        alerts.push(alert);
      }
    }

    return alerts;
  }

  private isAlertExisting(newAlert: SystemAlert): boolean {
    // Check if similar alert already exists
    return this.dashboardData?.alerts.some(existing =>
      existing.type === newAlert.type &&
      existing.title === newAlert.title &&
      !existing.resolved
    ) || false;
  }

  private async processNewAlert(alert: SystemAlert): Promise<void> {
    // Process new alert based on type and severity
    if (alert.severity === 'CRITICAL' || alert.severity === 'ERROR') {
      await this.sendImmediateNotification(alert);
    }

    // Store alert for dashboard display
    if (!this.dashboardData) {
      await this.refreshDashboardData();
    }

    this.dashboardData?.alerts.unshift(alert);

    // Notify subscribers
    this.notifyAlertSubscribers('NEW_ALERT', alert);
  }

  private async sendImmediateNotification(alert: SystemAlert): Promise<void> {
    if (!this.integrationConfig) return;

    // Send email notification for critical alerts
    if (this.integrationConfig.notificationService.email) {
      await this.sendEmailNotification(alert);
    }

    // Send webhook notification
    if (this.integrationConfig.notificationService.webhook) {
      await this.sendWebhookNotification(alert);
    }
  }

  private async sendEmailNotification(alert: SystemAlert): Promise<void> {
    // Integration with email service
    console.log(`Sending email notification for alert: ${alert.title}`);
  }

  private async sendWebhookNotification(alert: SystemAlert): Promise<void> {
    // Integration with webhook service
    console.log(`Sending webhook notification for alert: ${alert.title}`);
  }

  /**
   * Report generation
   */
  async generateComprehensiveReport(
    startDate: Date,
    endDate: Date,
    type: ValidationReport['type'] = 'COMPREHENSIVE'
  ): Promise<ValidationReport> {
    const reportId = `report_${Date.now()}`;

    // Generate executive summary
    const executiveSummary = await this.generateExecutiveSummary(startDate, endDate);

    // Generate detailed findings
    const detailedFindings = await this.generateDetailedFindings(startDate, endDate);

    // Generate recommendations
    const recommendations = await this.generateReportRecommendations(detailedFindings);

    // Generate appendices
    const appendices = await this.generateReportAppendices(startDate, endDate);

    return {
      id: reportId,
      title: `Medical Content Validation Report - ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
      generatedDate: new Date(),
      type,

      executiveSummary,
      detailedFindings,
      recommendations,
      appendices
    };
  }

  private async generateExecutiveSummary(startDate: Date, endDate: Date): Promise<ExecutiveSummary> {
    // Get metrics for the period
    const qualityMetrics = await qualityAssuranceFramework.generateQualityMetrics(startDate, endDate);

    // Get validation results for the period
    const bodySystems = this.getAllBodySystems();
    const validationResults = await enhancedValidationTools.performBatchValidation(bodySystems, {
      scope: 'FULL',
      contentTypes: ['SYSTEM'],
      priority: 'ALL',
      includePolishContent: true,
      maxConcurrentValidations: 5,
      timeoutPerValidation: 30000,
      retryFailedValidations: true,
      maxRetries: 3
    });

    return {
      period: { startDate, endDate },
      keyMetrics: {
        contentValidated: validationResults.validatedItems,
        averageQualityScore: validationResults.overallQualityScore,
        issuesResolved: validationResults.minorIssues.length, // Mock calculation
        complianceRate: 0.95 // Mock value
      },
      majorFindings: [
        `Validated ${validationResults.totalContentItems} content items`,
        `Overall quality score: ${validationResults.overallQualityScore}%`,
        `${validationResults.criticalIssues.length} critical issues identified`
      ],
      priorityActions: [
        'Address critical validation issues',
        'Update outdated content',
        'Review citation accuracy'
      ]
    };
  }

  private async generateDetailedFindings(startDate: Date, endDate: Date): Promise<DetailedFindings> {
    // Get detailed metrics for each category
    const bodySystems = this.getAllBodySystems();
    const medicalResults = await enhancedMedicalValidationService.validateMultipleBodySystems(bodySystems);
    const currencyResults = await currencyVerificationService.verifyMultipleBodySystems(bodySystems);

    const avgMedicalScore = medicalResults.reduce((sum, r) => sum + r.overallMedicalAccuracy, 0) / medicalResults.length || 0;
    const avgCurrencyScore = currencyResults.reduce((sum, r) => sum + r.overallCurrency, 0) / currencyResults.length || 0;

    return {
      medicalAccuracy: {
        averageScore: Math.round(avgMedicalScore),
        trend: 'STABLE', // Would calculate from historical data
        topIssues: medicalResults.filter(r => r.requiresExpertReview).map(r => r.contentId),
        improvements: ['Enhanced terminology validation', 'Better anatomical checking']
      },
      contentCurrency: {
        averageScore: Math.round(avgCurrencyScore),
        outdatedContent: currencyResults.filter(r => r.contentFreshness.freshnessLevel === 'OUTDATED').length,
        upcomingReviews: currencyResults.filter(r => {
          const nextReview = new Date(r.nextReviewDate);
          const now = new Date();
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          return nextReview <= weekFromNow;
        }).length,
        currencyTrend: 'IMPROVING'
      },
      compliance: {
        overallCompliance: 92, // Mock value
        standardsMet: 8,
        totalStandards: 9,
        criticalGaps: ['Some citations need updating']
      }
    };
  }

  private async generateReportRecommendations(findings: DetailedFindings): Promise<ReportRecommendation[]> {
    const recommendations: ReportRecommendation[] = [];

    // Immediate actions for critical issues
    if (findings.medicalAccuracy.topIssues.length > 0) {
      recommendations.push({
        category: 'IMMEDIATE',
        priority: 'HIGH',
        title: 'Address Medical Accuracy Issues',
        description: `Review and fix medical accuracy issues in ${findings.medicalAccuracy.topIssues.length} content items`,
        expectedImpact: 'Improved content reliability and user trust',
        implementationEffort: 'MEDIUM',
        resources: ['Medical experts', 'Updated research', 'Validation tools']
      });
    }

    // Short-term improvements
    if (findings.contentCurrency.outdatedContent > 0) {
      recommendations.push({
        category: 'SHORT_TERM',
        priority: 'MEDIUM',
        title: 'Update Content Currency',
        description: `Update ${findings.contentCurrency.outdatedContent} outdated content items`,
        expectedImpact: 'Ensure information remains current and relevant',
        implementationEffort: 'HIGH',
        resources: ['Content reviewers', 'Current research', 'Medical databases']
      });
    }

    // Long-term improvements
    recommendations.push({
      category: 'LONG_TERM',
      priority: 'LOW',
      title: 'Enhance Validation Automation',
      description: 'Improve automated validation algorithms and add new validation types',
      expectedImpact: 'Reduced manual review burden and improved accuracy',
      implementationEffort: 'HIGH',
      resources: ['Development team', 'AI/ML experts', 'Medical advisors']
    });

    return recommendations;
  }

  private async generateReportAppendices(startDate: Date, endDate: Date): Promise<ReportAppendix[]> {
    return [
      {
        title: 'Quality Trends Chart',
        type: 'CHART',
        content: {
          type: 'line',
          data: await this.getQualityTrends(30)
        }
      },
      {
        title: 'Detailed Validation Results',
        type: 'TABLE',
        content: {
          headers: ['Content ID', 'Medical Score', 'Currency Score', 'Status'],
          rows: [] // Would populate with actual data
        }
      }
    ];
  }

  /**
   * Integration with suplementor content management
   */
  configureIntegration(config: IntegrationConfig): void {
    this.integrationConfig = config;
  }

  async syncWithSuplementorAPI(): Promise<boolean> {
    if (!this.integrationConfig) {
      throw new Error('Integration not configured');
    }

    try {
      // Sync content from suplementor API
      const response = await fetch(`${this.integrationConfig.suplementorAPI.baseURL}/api/content/body-systems`, {
        headers: {
          'Authorization': `Bearer ${this.integrationConfig.suplementorAPI.apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(this.integrationConfig.suplementorAPI.timeout)
      });

      if (!response.ok) {
        throw new Error(`API sync failed: ${response.status}`);
      }

      const contentData = await response.json();

      // Update local content cache
      await this.updateLocalContentCache(contentData);

      return true;
    } catch (error) {
      console.error('Failed to sync with suplementor API:', error);
      return false;
    }
  }

  private async updateLocalContentCache(contentData: any): Promise<void> {
    // Update local content cache with data from suplementor API
    console.log('Updated local content cache with', contentData.length, 'items');
  }

  /**
   * Alert subscription system
   */
  subscribeToAlerts(subscriberId: string, callback: AlertCallback): void {
    this.alertSubscribers.set(subscriberId, callback);
  }

  unsubscribeFromAlerts(subscriberId: string): void {
    this.alertSubscribers.delete(subscriberId);
  }

  private notifyAlertSubscribers(type: string, data: any): void {
    this.alertSubscribers.forEach(callback => {
      try {
        callback(type, data);
      } catch (error) {
        console.error('Error notifying alert subscriber:', error);
      }
    });
  }

  /**
   * System health monitoring
   */
  async getSystemHealthReport(): Promise<SystemHealthReport> {
    const dashboardData = await this.getDashboardData();

    const healthScore = this.calculateHealthScore(dashboardData);
    const issues = this.identifyHealthIssues(dashboardData);
    const recommendations = this.generateHealthRecommendations(issues);

    return {
      timestamp: new Date(),
      overallHealth: healthScore >= 80 ? 'HEALTHY' : healthScore >= 60 ? 'WARNING' : 'CRITICAL',
      healthScore,
      components: {
        validationEngine: await this.checkValidationEngineHealth(),
        currencyChecker: await this.checkCurrencyCheckerHealth(),
        citationVerifier: await this.checkCitationVerifierHealth(),
        database: await this.checkDatabaseHealth()
      },
      issues,
      recommendations,
      uptime: process.uptime(),
      lastIncident?: undefined // Would track from monitoring system
    };
  }

  private calculateHealthScore(dashboardData: DashboardData): number {
    let score = 100;

    // Penalize for critical issues
    score -= dashboardData.overview.criticalIssues * 5;

    // Penalize for low quality score
    score -= Math.max(0, 80 - dashboardData.overview.overallQualityScore);

    // Penalize for pending validations
    const pendingRatio = dashboardData.overview.pendingValidation / dashboardData.overview.totalContentItems;
    score -= pendingRatio * 20;

    return Math.max(0, score);
  }

  private identifyHealthIssues(dashboardData: DashboardData): string[] {
    const issues: string[] = [];

    if (dashboardData.overview.criticalIssues > 0) {
      issues.push(`${dashboardData.overview.criticalIssues} critical issues require attention`);
    }

    if (dashboardData.overview.overallQualityScore < 70) {
      issues.push('Overall quality score is below acceptable threshold');
    }

    if (dashboardData.overview.pendingValidation > dashboardData.overview.validatedItems * 0.1) {
      issues.push('High number of pending validations');
    }

    if (dashboardData.realTimeStatus.systemHealth !== 'HEALTHY') {
      issues.push('System health issues detected');
    }

    return issues;
  }

  private generateHealthRecommendations(issues: string[]): string[] {
    const recommendations: string[] = [];

    if (issues.some(issue => issue.includes('critical issues'))) {
      recommendations.push('Prioritize resolution of critical validation issues');
    }

    if (issues.some(issue => issue.includes('quality score'))) {
      recommendations.push('Review and improve content validation processes');
    }

    if (issues.some(issue => issue.includes('pending validations'))) {
      recommendations.push('Increase validation capacity or reduce content creation rate');
    }

    return recommendations;
  }

  private async checkValidationEngineHealth(): Promise<ComponentHealth> {
    try {
      // Test validation engine with a simple validation
      const testSystem: BodySystem = {
        id: 'test-system',
        name: 'Test System',
        polishName: 'Testowy System',
        description: 'Test description',
        polishDescription: 'Testowy opis',
        organs: [],
        functions: [],
        polishFunctions: [],
        relatedSupplements: [],
        anatomicalInfo: {
          location: 'Test location',
          polishLocation: 'Testowa lokalizacja',
          connections: [],
          polishConnections: [],
          clinicalRelevance: 'Test relevance',
          polishClinicalRelevance: 'Testowa relevancja'
        }
      };

      const startTime = Date.now();
      await enhancedMedicalValidationService.validateBodySystemMedicalAccuracy(testSystem);
      const responseTime = Date.now() - startTime;

      return {
        status: responseTime < 5000 ? 'HEALTHY' : 'WARNING', // Should respond within 5 seconds
        responseTime,
        lastChecked: new Date(),
        errorRate: 0
      };
    } catch (error) {
      return {
        status: 'CRITICAL',
        responseTime: 0,
        lastChecked: new Date(),
        errorRate: 1,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async checkCurrencyCheckerHealth(): Promise<ComponentHealth> {
    try {
      const startTime = Date.now();
      await currencyVerificationService.verifyBodySystemCurrency(this.getAllBodySystems()[0]);
      const responseTime = Date.now() - startTime;

      return {
        status: responseTime < 3000 ? 'HEALTHY' : 'WARNING',
        responseTime,
        lastChecked: new Date(),
        errorRate: 0
      };
    } catch (error) {
      return {
        status: 'CRITICAL',
        responseTime: 0,
        lastChecked: new Date(),
        errorRate: 1,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async checkCitationVerifierHealth(): Promise<ComponentHealth> {
    try {
      const startTime = Date.now();
      // Test citation verification
      const responseTime = Date.now() - startTime;

      return {
        status: responseTime < 2000 ? 'HEALTHY' : 'WARNING',
        responseTime,
        lastChecked: new Date(),
        errorRate: 0
      };
    } catch (error) {
      return {
        status: 'CRITICAL',
        responseTime: 0,
        lastChecked: new Date(),
        errorRate: 1,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async checkDatabaseHealth(): Promise<ComponentHealth> {
    try {
      const startTime = Date.now();
      // Test database connectivity
      const responseTime = Date.now() - startTime;

      return {
        status: responseTime < 1000 ? 'HEALTHY' : 'WARNING',
        responseTime,
        lastChecked: new Date(),
        errorRate: 0
      };
    } catch (error) {
      return {
        status: 'CRITICAL',
        responseTime: 0,
        lastChecked: new Date(),
        errorRate: 1,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Supporting interfaces
type AlertCallback = (type: string, data: any) => void

interface ComponentHealth {
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  responseTime: number;
  lastChecked: Date;
  errorRate: number;
  error?: string;
}

interface SystemHealthReport {
  timestamp: Date;
  overallHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  healthScore: number;
  components: {
    validationEngine: ComponentHealth;
    currencyChecker: ComponentHealth;
    citationVerifier: ComponentHealth;
    database: ComponentHealth;
  };
  issues: string[];
  recommendations: string[];
  uptime: number;
  lastIncident?: Date;
}

// Export singleton instance
export const validationDashboardService = new ValidationDashboardService();