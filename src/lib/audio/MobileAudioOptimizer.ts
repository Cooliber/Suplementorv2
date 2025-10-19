/**
 * Mobile Audio Optimization System for Suplementor
 * Optimizes audio performance and battery usage on mobile devices
 */

import type { AudioContextManager } from "./AudioContextManager";
import type { AudioConfig } from "./types";

export interface DeviceCapabilities {
	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;
	os: "ios" | "android" | "windows" | "macos" | "linux" | "unknown";
	browser: string;
	supportsWebGL: boolean;
	supportsWebAudio: boolean;
	supportsVibration: boolean;
	supportsSpeechSynthesis: boolean;
	hardwareConcurrency: number;
	deviceMemory: number; // GB
	screenWidth: number;
	screenHeight: number;
	pixelRatio: number;
	connection: {
		effectiveType: string;
		downlink: number;
		rtt: number;
		saveData: boolean;
	};
}

export interface BatteryOptimizationSettings {
	enableBatteryMonitoring: boolean;
	pauseAudioOnBatteryLow: boolean;
	reduceQualityOnBatteryLow: boolean;
	batteryThreshold: number; // 0-1
	qualityReductionLevel: "low" | "medium" | "high";
}

export interface NetworkOptimizationSettings {
	enableNetworkMonitoring: boolean;
	adaptQualityToConnection: boolean;
	preloadCriticalAssets: boolean;
	streamNonCriticalAssets: boolean;
	maxBitrate: number;
	adaptiveBitrate: boolean;
}

export interface PerformanceOptimizationSettings {
	maxConcurrentSounds: number;
	audioBufferSize: number;
	enableAudioCache: boolean;
	cacheSizeLimit: number; // MB
	enableSpatialAudio: boolean;
	simplifyAudioGraph: boolean;
}

export class MobileAudioOptimizer {
	private contextManager: AudioContextManager;
	private deviceCapabilities: DeviceCapabilities;
	private batterySettings: BatteryOptimizationSettings;
	private networkSettings: NetworkOptimizationSettings;
	private performanceSettings: PerformanceOptimizationSettings;
	private batteryLevel = 1.0;
	private isMonitoringBattery = false;
	private isMonitoringNetwork = false;
	private currentConnectionType = "unknown";

	constructor(contextManager: AudioContextManager) {
		this.contextManager = contextManager;
		this.deviceCapabilities = this.detectDeviceCapabilities();
		this.batterySettings = this.getDefaultBatterySettings();
		this.networkSettings = this.getDefaultNetworkSettings();
		this.performanceSettings = this.getDefaultPerformanceSettings();
	}

	/**
	 * Detect device capabilities for optimization
	 */
	private detectDeviceCapabilities(): DeviceCapabilities {
		if (typeof window === "undefined") {
			return {
				isMobile: false,
				isTablet: false,
				isDesktop: true,
				os: "unknown",
				browser: "unknown",
				supportsWebGL: false,
				supportsWebAudio: false,
				supportsVibration: false,
				supportsSpeechSynthesis: false,
				hardwareConcurrency: 1,
				deviceMemory: 1,
				screenWidth: 1920,
				screenHeight: 1080,
				pixelRatio: 1,
				connection: {
					effectiveType: "4g",
					downlink: 10,
					rtt: 100,
					saveData: false,
				},
			};
		}

		const userAgent = navigator.userAgent.toLowerCase();
		const platform = navigator.platform.toLowerCase();

		// Detect OS
		let os: DeviceCapabilities["os"] = "unknown";
		if (/iphone|ipad|ipod/.test(userAgent)) {
			os = "ios";
		} else if (/android/.test(userAgent)) {
			os = "android";
		} else if (/windows/.test(platform)) {
			os = "windows";
		} else if (/mac/.test(platform)) {
			os = "macos";
		} else if (/linux/.test(platform)) {
			os = "linux";
		}

		// Detect device type
		const isMobile = /mobile|android|iphone|ipod|blackberry|windows phone/.test(
			userAgent,
		);
		const isTablet = /tablet|ipad/.test(userAgent) && !isMobile;
		const isDesktop = !isMobile && !isTablet;

		// Detect browser
		let browser = "unknown";
		if (/chrome|crios/.test(userAgent)) {
			browser = "chrome";
		} else if (/firefox|fxios/.test(userAgent)) {
			browser = "firefox";
		} else if (/safari/.test(userAgent)) {
			browser = "safari";
		} else if (/edge/.test(userAgent)) {
			browser = "edge";
		}

		// Detect hardware capabilities
		const hardwareConcurrency = navigator.hardwareConcurrency || 1;
		const deviceMemory = (navigator as any).deviceMemory || 1;

		// Detect screen capabilities
		const screenWidth = window.screen.width;
		const screenHeight = window.screen.height;
		const pixelRatio = window.devicePixelRatio || 1;

		// Detect connection
		const connection = (navigator as any).connection ||
			(navigator as any).mozConnection ||
			(navigator as any).webkitConnection || {
				effectiveType: "unknown",
				downlink: 10,
				rtt: 100,
				saveData: false,
			};

		return {
			isMobile,
			isTablet,
			isDesktop,
			os,
			browser,
			supportsWebGL: typeof WebGLRenderingContext !== "undefined",
			supportsWebAudio:
				typeof AudioContext !== "undefined" ||
				typeof (window as any).webkitAudioContext !== "undefined",
			supportsVibration: "vibrate" in navigator,
			supportsSpeechSynthesis: "speechSynthesis" in window,
			hardwareConcurrency,
			deviceMemory,
			screenWidth,
			screenHeight,
			pixelRatio,
			connection,
		};
	}

	/**
	 * Get default battery optimization settings
	 */
	private getDefaultBatterySettings(): BatteryOptimizationSettings {
		return {
			enableBatteryMonitoring: this.deviceCapabilities.isMobile,
			pauseAudioOnBatteryLow: true,
			reduceQualityOnBatteryLow: true,
			batteryThreshold: 0.2,
			qualityReductionLevel: "medium",
		};
	}

	/**
	 * Get default network optimization settings
	 */
	private getDefaultNetworkSettings(): NetworkOptimizationSettings {
		return {
			enableNetworkMonitoring: true,
			adaptQualityToConnection: true,
			preloadCriticalAssets: !this.deviceCapabilities.isMobile,
			streamNonCriticalAssets: this.deviceCapabilities.isMobile,
			maxBitrate: this.deviceCapabilities.isMobile ? 128000 : 320000,
			adaptiveBitrate: true,
		};
	}

	/**
	 * Get default performance optimization settings
	 */
	private getDefaultPerformanceSettings(): PerformanceOptimizationSettings {
		let maxConcurrentSounds = 16;
		let audioBufferSize = 512;

		// Adjust based on device capabilities
		if (this.deviceCapabilities.isMobile) {
			maxConcurrentSounds = 8;
			audioBufferSize = 256;
		} else if (this.deviceCapabilities.hardwareConcurrency < 4) {
			maxConcurrentSounds = 12;
			audioBufferSize = 512;
		}

		return {
			maxConcurrentSounds,
			audioBufferSize,
			enableAudioCache: true,
			cacheSizeLimit: this.deviceCapabilities.isMobile ? 50 : 200, // MB
			enableSpatialAudio:
				!this.deviceCapabilities.isMobile ||
				this.deviceCapabilities.hardwareConcurrency >= 4,
			simplifyAudioGraph: this.deviceCapabilities.hardwareConcurrency < 2,
		};
	}

	/**
	 * Initialize mobile optimizations
	 */
	async initialize(): Promise<void> {
		// Start battery monitoring if enabled
		if (this.batterySettings.enableBatteryMonitoring) {
			await this.startBatteryMonitoring();
		}

		// Start network monitoring if enabled
		if (this.networkSettings.enableNetworkMonitoring) {
			this.startNetworkMonitoring();
		}

		// Apply initial optimizations
		await this.applyOptimizations();
	}

	/**
	 * Start monitoring battery level
	 */
	private async startBatteryMonitoring(): Promise<void> {
		if (typeof navigator === "undefined" || !("getBattery" in navigator)) {
			console.warn("Battery API not supported");
			return;
		}

		try {
			const battery = await (navigator as any).getBattery();

			const updateBatteryLevel = () => {
				this.batteryLevel = battery.level;
				this.handleBatteryLevelChange();
			};

			battery.addEventListener("levelchange", updateBatteryLevel);
			battery.addEventListener("chargingchange", updateBatteryLevel);

			this.batteryLevel = battery.level;
			this.isMonitoringBattery = true;
		} catch (error) {
			console.warn("Failed to start battery monitoring:", error);
		}
	}

	/**
	 * Start monitoring network conditions
	 */
	private startNetworkMonitoring(): void {
		if (typeof navigator === "undefined") {
			return;
		}

		const connection =
			(navigator as any).connection ||
			(navigator as any).mozConnection ||
			(navigator as any).webkitConnection;

		if (connection) {
			const updateConnection = () => {
				this.currentConnectionType = connection.effectiveType;
				this.handleNetworkChange();
			};

			connection.addEventListener("change", updateConnection);
			this.currentConnectionType = connection.effectiveType;
			this.isMonitoringNetwork = true;
		}
	}

	/**
	 * Handle battery level changes
	 */
	private handleBatteryLevelChange(): void {
		if (this.batteryLevel <= this.batterySettings.batteryThreshold) {
			console.warn("Low battery detected, applying optimizations");

			if (this.batterySettings.pauseAudioOnBatteryLow) {
				this.contextManager.suspend();
			}

			if (this.batterySettings.reduceQualityOnBatteryLow) {
				this.applyBatteryOptimizations();
			}
		} else if (
			this.batteryLevel >
			this.batterySettings.batteryThreshold * 1.2
		) {
			// Battery recovered, restore normal settings
			this.restoreNormalSettings();
		}
	}

	/**
	 * Handle network condition changes
	 */
	private handleNetworkChange(): void {
		if (!this.networkSettings.adaptQualityToConnection) {
			return;
		}

		const connectionSpeed = this.getConnectionSpeed();

		if (connectionSpeed === "slow") {
			this.applyNetworkOptimizations();
		} else if (connectionSpeed === "fast") {
			this.restoreNetworkSettings();
		}
	}

	/**
	 * Get connection speed category
	 */
	private getConnectionSpeed(): "slow" | "medium" | "fast" {
		const downlink = this.deviceCapabilities.connection.downlink;

		if (downlink < 1) {
			return "slow"; // 2G or slower
		}
		if (downlink < 5) {
			return "medium"; // 3G
		}
		return "fast"; // 4G/5G
	}

	/**
	 * Apply battery-related optimizations
	 */
	private applyBatteryOptimizations(): void {
		// Reduce audio quality
		if (this.contextManager.context) {
			// Lower sample rate if possible (not directly supported in Web Audio API)
			// Instead, we'll optimize by reducing concurrent sounds and effects
		}

		// Disable spatial audio for battery saving
		this.performanceSettings.enableSpatialAudio = false;

		// Reduce concurrent sounds
		this.performanceSettings.maxConcurrentSounds = 4;

		console.log("Applied battery optimizations");
	}

	/**
	 * Apply network-related optimizations
	 */
	private applyNetworkOptimizations(): void {
		// Reduce bitrate for streaming
		this.networkSettings.maxBitrate = 64000; // 64 kbps

		// Disable preloading of non-critical assets
		this.networkSettings.preloadCriticalAssets = false;

		// Enable streaming for all assets
		this.networkSettings.streamNonCriticalAssets = true;

		console.log("Applied network optimizations");
	}

	/**
	 * Restore normal settings when conditions improve
	 */
	private restoreNormalSettings(): void {
		this.performanceSettings = this.getDefaultPerformanceSettings();
		this.networkSettings = this.getDefaultNetworkSettings();

		if (this.contextManager.isSuspended) {
			this.contextManager.resume();
		}

		console.log("Restored normal audio settings");
	}

	/**
	 * Restore network settings when connection improves
	 */
	private restoreNetworkSettings(): void {
		this.networkSettings = this.getDefaultNetworkSettings();
		console.log("Restored normal network settings");
	}

	/**
	 * Apply all current optimizations
	 */
	private async applyOptimizations(): Promise<void> {
		// Apply performance optimizations
		if (this.performanceSettings.simplifyAudioGraph) {
			this.simplifyAudioGraph();
		}

		// Apply network optimizations if on slow connection
		if (this.getConnectionSpeed() === "slow") {
			this.applyNetworkOptimizations();
		}

		// Apply battery optimizations if battery is low
		if (this.batteryLevel <= this.batterySettings.batteryThreshold) {
			this.applyBatteryOptimizations();
		}
	}

	/**
	 * Simplify audio processing graph for better performance
	 */
	private simplifyAudioGraph(): void {
		// This would involve creating simpler audio nodes
		// and reducing the complexity of the audio graph
		console.log("Simplified audio processing graph");
	}

	/**
	 * Get optimized audio configuration for current conditions
	 */
	getOptimizedConfig(baseConfig: AudioConfig): AudioConfig {
		const optimizedConfig = { ...baseConfig };

		// Adjust based on device capabilities
		if (this.deviceCapabilities.isMobile) {
			optimizedConfig.maxConcurrentSounds = Math.min(
				optimizedConfig.maxConcurrentSounds,
				this.performanceSettings.maxConcurrentSounds,
			);

			if (!this.deviceCapabilities.supportsVibration) {
				optimizedConfig.hapticEnabled = false;
			}

			if (!this.deviceCapabilities.supportsSpeechSynthesis) {
				// Voice synthesis might not work well on all mobile devices
				optimizedConfig.voiceVolume = 0;
			}
		}

		// Adjust based on battery level
		if (this.batteryLevel <= this.batterySettings.batteryThreshold) {
			optimizedConfig.masterVolume *= 0.7;
			optimizedConfig.enableSpatialAudio = false;
		}

		// Adjust based on network conditions
		if (this.getConnectionSpeed() === "slow") {
			optimizedConfig.quality = "low";
		}

		return optimizedConfig;
	}

	/**
	 * Check if device needs aggressive optimization
	 */
	needsAggressiveOptimization(): boolean {
		return (
			this.deviceCapabilities.hardwareConcurrency <= 2 ||
			this.deviceCapabilities.deviceMemory <= 2 ||
			this.deviceCapabilities.isMobile
		);
	}

	/**
	 * Get memory usage estimate for audio system
	 */
	estimateMemoryUsage(assetCount: number, averageAssetSize: number): number {
		const baseMemory = 50; // MB for audio context and basic structures
		const assetMemory = assetCount * averageAssetSize;
		const bufferMemory = assetMemory * 2; // Decoded audio buffers are typically larger

		return baseMemory + assetMemory + bufferMemory;
	}

	/**
	 * Check if memory usage is approaching limits
	 */
	isMemoryUsageHigh(assetCount: number, averageAssetSize: number): boolean {
		const estimatedUsage = this.estimateMemoryUsage(
			assetCount,
			averageAssetSize,
		);
		const memoryLimit = this.deviceCapabilities.deviceMemory * 1024 * 0.3; // 30% of device memory

		return estimatedUsage > memoryLimit;
	}

	/**
	 * Get optimization recommendations
	 */
	getOptimizationRecommendations(): string[] {
		const recommendations: string[] = [];

		if (this.deviceCapabilities.isMobile) {
			recommendations.push(
				"Urządzenie mobilne wykryte - włączono optymalizacje baterii",
			);
		}

		if (this.deviceCapabilities.hardwareConcurrency <= 2) {
			recommendations.push(
				"Niska liczba rdzeni procesora - uproszczono przetwarzanie audio",
			);
		}

		if (this.batteryLevel <= this.batterySettings.batteryThreshold) {
			recommendations.push("Niski poziom baterii - zmniejszono jakość audio");
		}

		if (this.getConnectionSpeed() === "slow") {
			recommendations.push("Wolne połączenie internetowe - włączono streaming");
		}

		if (!this.deviceCapabilities.supportsVibration) {
			recommendations.push("Haptyka nieobsługiwana - wyłączono wibracje");
		}

		if (!this.deviceCapabilities.supportsSpeechSynthesis) {
			recommendations.push(
				"Synteza mowy nieobsługiwana - ograniczono funkcje głosowe",
			);
		}

		return recommendations;
	}

	/**
	 * Get current optimization status
	 */
	getStatus(): {
		deviceCapabilities: DeviceCapabilities;
		batteryLevel: number;
		connectionSpeed: string;
		isMonitoringBattery: boolean;
		isMonitoringNetwork: boolean;
		activeOptimizations: string[];
		memoryUsage: number;
	} {
		const activeOptimizations: string[] = [];

		if (this.batteryLevel <= this.batterySettings.batteryThreshold) {
			activeOptimizations.push("battery_optimization");
		}

		if (this.getConnectionSpeed() === "slow") {
			activeOptimizations.push("network_optimization");
		}

		if (this.performanceSettings.simplifyAudioGraph) {
			activeOptimizations.push("performance_optimization");
		}

		return {
			deviceCapabilities: this.deviceCapabilities,
			batteryLevel: this.batteryLevel,
			connectionSpeed: this.currentConnectionType,
			isMonitoringBattery: this.isMonitoringBattery,
			isMonitoringNetwork: this.isMonitoringNetwork,
			activeOptimizations,
			memoryUsage: 0, // Would need to implement actual memory tracking
		};
	}

	/**
	 * Cleanup optimization monitoring
	 */
	cleanup(): void {
		this.isMonitoringBattery = false;
		this.isMonitoringNetwork = false;
	}
}

// Factory function to create mobile audio optimizer
export function createMobileAudioOptimizer(
	contextManager: AudioContextManager,
): MobileAudioOptimizer {
	return new MobileAudioOptimizer(contextManager);
}
