"use client";

import { useErrorHandler } from "@/hooks/use-error-handler";
import { useLoadingState } from "@/components/ui/loading-error";
import type { DosageCalculationInput, DosageCalculationResult } from "@/types/dosage-calculator";

export interface CalculationError {
  type: "validation" | "calculation" | "network" | "server";
  field?: string;
  message: string;
  code?: string;
}

export interface CalculationOptions {
  timeout?: number;
  retryAttempts?: number;
  includeInteractions?: boolean;
  includeContraindications?: boolean;
  safetyMargin?: number;
}

class DosageCalculationService {
  private static instance: DosageCalculationService;
  private readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
  private readonly DEFAULT_RETRY_ATTEMPTS = 2;

  static getInstance(): DosageCalculationService {
    if (!DosageCalculationService.instance) {
      DosageCalculationService.instance = new DosageCalculationService();
    }
    return DosageCalculationService.instance;
  }

  // Input validation with detailed error reporting
  validateInput(input: DosageCalculationInput): CalculationError[] {
    const errors: CalculationError[] = [];

    // User profile validation
    if (!input.userProfile) {
      errors.push({
        type: "validation",
        field: "userProfile",
        message: "Profil użytkownika jest wymagany",
        code: "MISSING_USER_PROFILE",
      });
    } else {
      const profile = input.userProfile;

      if (!profile.age || profile.age < 1 || profile.age > 150) {
        errors.push({
          type: "validation",
          field: "age",
          message: "Wiek musi być między 1 a 150 lat",
          code: "INVALID_AGE",
        });
      }

      if (!profile.weight || profile.weight < 1 || profile.weight > 500) {
        errors.push({
          type: "validation",
          field: "weight",
          message: "Waga musi być między 1 a 500 kg",
          code: "INVALID_WEIGHT",
        });
      }

      if (!profile.height || profile.height < 50 || profile.height > 250) {
        errors.push({
          type: "validation",
          field: "height",
          message: "Wzrost musi być między 50 a 250 cm",
          code: "INVALID_HEIGHT",
        });
      }

      if (!profile.gender) {
        errors.push({
          type: "validation",
          field: "gender",
          message: "Płeć jest wymagana",
          code: "MISSING_GENDER",
        });
      }

      // Pregnancy/breastfeeding validation
      if (profile.pregnant && profile.gender !== "female") {
        errors.push({
          type: "validation",
          field: "pregnant",
          message: "Tylko kobiety mogą być w ciąży",
          code: "INVALID_PREGNANCY_STATUS",
        });
      }

      if (profile.breastfeeding && profile.gender !== "female") {
        errors.push({
          type: "validation",
          field: "breastfeeding",
          message: "Tylko kobiety mogą karmić piersią",
          code: "INVALID_BREASTFEEDING_STATUS",
        });
      }
    }

    // Supplements validation
    if (!input.supplements || input.supplements.length === 0) {
      errors.push({
        type: "validation",
        field: "supplements",
        message: "Wybierz przynajmniej jeden suplement",
        code: "NO_SUPPLEMENTS_SELECTED",
      });
    } else {
      input.supplements.forEach((supplement, index) => {
        if (!supplement.supplementId || supplement.supplementId.trim() === "") {
          errors.push({
            type: "validation",
            field: `supplements[${index}].supplementId`,
            message: `ID suplementu ${index + 1} jest wymagane`,
            code: "MISSING_SUPPLEMENT_ID",
          });
        }

        if (!supplement.desiredEffect) {
          errors.push({
            type: "validation",
            field: `supplements[${index}].desiredEffect`,
            message: `Efekt pożądany suplementu ${index + 1} jest wymagany`,
            code: "MISSING_DESIRED_EFFECT",
          });
        }
      });
    }

    return errors;
  }

  // Calculate BMI and basic health metrics
  calculateHealthMetrics(userProfile: DosageCalculationInput["userProfile"]) {
    const heightM = userProfile.height / 100;
    const bmi = userProfile.weight / (heightM * heightM);

    let bmiCategory = "normal";
    if (bmi < 18.5) bmiCategory = "underweight";
    else if (bmi < 25) bmiCategory = "normal";
    else if (bmi < 30) bmiCategory = "overweight";
    else bmiCategory = "obese";

    // Basic metabolic rate (Mifflin-St Jeor Equation)
    let bmr = 0;
    if (userProfile.gender === "male") {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
    } else {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161;
    }

    // Activity level multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const tdee = bmr * (activityMultipliers[userProfile.activityLevel] || 1.55);

    return {
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
    };
  }

  // Simulate dosage calculation with error scenarios
  async calculateDosage(
    input: DosageCalculationInput,
    options: CalculationOptions = {}
  ): Promise<DosageCalculationResult> {
    const timeout = options.timeout || this.DEFAULT_TIMEOUT;
    const retryAttempts = options.retryAttempts || this.DEFAULT_RETRY_ATTEMPTS;

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Obliczenia przekroczyły limit czasu"));
      }, timeout);

      // Simulate calculation delay
      setTimeout(() => {
        clearTimeout(timeoutId);

        try {
          // Validate input
          const validationErrors = this.validateInput(input);
          if (validationErrors.length > 0) {
            throw new Error(`Błędy walidacji: ${validationErrors.map(e => e.message).join(", ")}`);
          }

          // Calculate health metrics
          const healthMetrics = this.calculateHealthMetrics(input.userProfile);

          // Simulate potential calculation errors (for testing)
          if (Math.random() < 0.1) { // 10% chance of calculation error
            throw new Error("Błąd podczas obliczania dawki - nieprawidłowe parametry suplementu");
          }

          // Generate mock results
          const result: DosageCalculationResult = {
            calculationId: `calc_${Date.now()}`,
            userProfile: input.userProfile,
            dosageRecommendations: input.supplements.map(supplement => ({
              supplementId: supplement.supplementId,
              supplementName: `Supplement ${supplement.supplementId}`,
              polishSupplementName: `Suplement ${supplement.supplementId}`,
              recommendedDosage: {
                min: 100,
                max: 500,
                unit: "mg",
              },
              confidence: 0.8,
              timing: supplement.timingPreference || ["morning"],
              withFood: supplement.withFood || false,
              duration: this.generateDuration(supplement),
              adjustments: [],
              pharmacokineticFactors: {
                bioavailability: 50,
                halfLife: 8,
                absorptionRate: 2,
                eliminationRate: 0.087,
                volumeOfDistribution: 50,
                proteinBinding: 80,
                firstPassMetabolism: 20,
              },
            })),
            safetyAlerts: [],
            interactionAnalysis: [],
            overallRisk: "low",
            totalConfidence: 0.85,
            calculationDate: new Date().toISOString(),
            warnings: [],
            polishWarnings: [],
            recommendations: input.supplements.map(s => `Rekomendacja dla suplementu ${s.supplementId}`),
            polishRecommendations: input.supplements.map(s => `Zalecenie dla suplementu ${s.supplementId}`),
          };

          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, 1000 + Math.random() * 2000); // 1-3 second delay
    });
  }

  // Helper methods for generating mock data
  private generateRecommendedDosage(supplement: any, userProfile: any) {
    const baseDosages: Record<string, string> = {
      "Vitamin D": "1000-2000 IU",
      "Vitamin C": "500-1000 mg",
      "Magnesium": "300-400 mg",
      "Omega-3": "1000-2000 mg",
      "Caffeine": "200-400 mg",
    };

    return baseDosages[supplement.name] || "100-500 mg";
  }

  private generateFrequency(supplement: any) {
    const frequencies = ["raz dziennie", "dwa razy dziennie", "trzy razy dziennie"];
    return frequencies[Math.floor(Math.random() * frequencies.length)];
  }

  private generateDuration(supplement: any): string {
    const durations = ["4-6 tygodni", "8-12 tygodni", "stałe przyjmowanie"];
    return durations[Math.floor(Math.random() * durations.length)]!;
  }

  private generateRationale(supplement: any, healthMetrics: any) {
    return `Rekomendacja oparta na profilu użytkownika (BMI: ${healthMetrics.bmi}, kategoria: ${healthMetrics.bmiCategory}) i aktualnych badaniach naukowych.`;
  }

  private generateWarnings(supplement: any, userProfile: any) {
    const warnings = [];
    if (userProfile.pregnant) {
      warnings.push("Konsultacja z lekarzem wymagana w czasie ciąży");
    }
    if (userProfile.currentMedications.length > 0) {
      warnings.push("Możliwe interakcje z aktualnymi lekami");
    }
    return warnings;
  }

  private generateInteractions(supplement: any) {
    return [
      {
        supplement: "Witamina K",
        severity: "moderate" as const,
        description: "Może zmniejszać skuteczność leków przeciwzakrzepowych",
      },
    ];
  }

  private generateContraindications(supplement: any, userProfile: any) {
    const contraindications = [];
    if (userProfile.healthConditions.includes("nadciśnienie")) {
      contraindications.push("Nie zaleca się przy nadciśnieniu tętniczym");
    }
    return contraindications;
  }

  private generateEvidenceLevel() {
    const levels = ["MODERATE", "STRONG", "WEAK"];
    return levels[Math.floor(Math.random() * levels.length)] as "MODERATE" | "STRONG" | "WEAK";
  }

  private calculateSafetyScore(input: DosageCalculationInput): number {
    let score = 100;

    // Reduce score for pregnancy
    if (input.userProfile.pregnant) score -= 20;

    // Reduce score for multiple medications
    if (input.userProfile.currentMedications.length > 2) score -= 15;

    // Reduce score for multiple health conditions
    if (input.userProfile.healthConditions.length > 2) score -= 10;

    return Math.max(0, score);
  }
}

// React hook for dosage calculation with error handling
export function useDosageCalculation() {
  const errorHandler = useErrorHandler();
  const loadingState = useLoadingState();

  const calculateDosage = async (
    input: DosageCalculationInput,
    options: CalculationOptions = {}
  ): Promise<DosageCalculationResult | null> => {
    loadingState.startLoading();

    try {
      const service = DosageCalculationService.getInstance();

      // Validate input first
      const validationErrors = service.validateInput(input);
      if (validationErrors.length > 0) {
        const firstError = validationErrors[0];
        throw new Error(firstError ? firstError.message : "Błędy walidacji danych wejściowych");
      }

      const result = await service.calculateDosage(input, options);
      loadingState.stopLoading();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Nie udało się obliczyć dawek";

      // Handle specific error types
      if (errorMessage.includes("walidacji")) {
        errorHandler.handleValidationError(errorMessage, "Sprawdź wprowadzone dane");
      } else if (errorMessage.includes("czas")) {
        errorHandler.handleDosageError("Obliczenia przekroczyły limit czasu. Spróbuj ponownie.");
      } else {
        errorHandler.handleDosageError(errorMessage);
      }

      loadingState.setLoadingError(errorMessage);
      return null;
    }
  };

  const retryCalculation = async (
    input: DosageCalculationInput,
    options: CalculationOptions = {}
  ) => {
    errorHandler.clearErrors();
    return calculateDosage(input, options);
  };

  return {
    calculateDosage,
    retryCalculation,
    isCalculating: loadingState.isLoading,
    error: loadingState.error,
    clearError: () => {
      loadingState.reset();
      errorHandler.clearErrors();
    },
  };
}

export default DosageCalculationService;