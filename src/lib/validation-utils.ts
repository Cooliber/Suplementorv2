import { z } from "zod";

// Base validation patterns
const polishTextRegex = /^[a-zA-ZąĄćĆęĘłŁńŃóÓśŚźŹżŻ\s\-]+$/;
const englishTextRegex = /^[a-zA-Z\s\-]+$/;
const alphanumericRegex = /^[a-zA-Z0-9ąĄćĆęĘłŁńŃóÓśŚźŹżŻ\s\-]+$/;
const dosageRegex = /^(\d+(?:\.\d+)?)\s*(mg|g|mcg|iu|kaps|tabl|ml|kropli?)$/i;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Custom validation functions
export const validateAge = (age: number): boolean => {
  return age >= 18 && age <= 120;
};

export const validateWeight = (weight: number): boolean => {
  return weight >= 30 && weight <= 300;
};

export const validateHeight = (height: number): boolean => {
  return height >= 100 && height <= 250;
};

export const validateDosageFormat = (dosage: string): boolean => {
  return dosageRegex.test(dosage.trim());
};

export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email.trim());
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+\d{2}\s?)?\d{3}[\s\-]?\d{3}[\s\-]?\d{3}$/;
  return phoneRegex.test(phone.trim());
};

// Supplement-specific validation schemas
export const SupplementFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nazwa suplementu musi mieć co najmniej 2 znaki")
    .max(100, "Nazwa suplementu nie może być dłuższa niż 100 znaków")
    .regex(alphanumericRegex, "Nazwa może zawierać tylko litery, cyfry, spacje i myślniki"),

  polishName: z
    .string()
    .min(2, "Polska nazwa musi mieć co najmniej 2 znaki")
    .max(100, "Polska nazwa nie może być dłuższa niż 100 znaków")
    .regex(polishTextRegex, "Polska nazwa może zawierać tylko polskie litery, spacje i myślniki")
    .optional(),

  description: z
    .string()
    .min(10, "Opis musi mieć co najmniej 10 znaków")
    .max(1000, "Opis nie może być dłuższy niż 1000 znaków"),

  polishDescription: z
    .string()
    .min(10, "Polski opis musi mieć co najmniej 10 znaków")
    .max(1000, "Polski opis nie może być dłuższy niż 1000 znaków")
    .optional(),

  category: z
    .string()
    .min(1, "Kategoria jest wymagana")
    .max(50, "Nazwa kategorii nie może być dłuższa niż 50 znaków"),

  subcategory: z
    .string()
    .max(50, "Nazwa podkategorii nie może być dłuższa niż 50 znaków")
    .optional(),

  brand: z
    .string()
    .min(1, "Marka jest wymagana")
    .max(100, "Nazwa marki nie może być dłuższa niż 100 znaków"),

  form: z.enum(["tabletki", "kapsułki", "proszek", "płyn", "krople", "żel", "inne"], {
    errorMap: () => ({ message: "Wybierz prawidłową formę suplementu" }),
  }),

  recommendedDosage: z
    .string()
    .min(1, "Zalecana dawka jest wymagana")
    .max(200, "Dawka nie może być dłuższa niż 200 znaków")
    .refine(validateDosageFormat, "Nieprawidłowy format dawki (np. '500mg dziennie')"),

  ingredients: z
    .array(z.string().min(1, "Składnik nie może być pusty"))
    .min(1, "Suplement musi zawierać co najmniej jeden składnik")
    .max(20, "Maksymalnie 20 składników"),

  warnings: z
    .array(z.string().min(1, "Ostrzeżenie nie może być puste"))
    .max(10, "Maksymalnie 10 ostrzeżeń")
    .optional(),

  contraindications: z
    .array(z.string().min(1, "Przeciwwskazanie nie może być puste"))
    .max(10, "Maksymalnie 10 przeciwwskazań")
    .optional(),

  price: z
    .number()
    .min(0.01, "Cena musi być większa niż 0")
    .max(10000, "Cena nie może być większa niż 10000")
    .optional(),

  currency: z.enum(["PLN", "EUR", "USD"]).default("PLN"),

  packageSize: z
    .string()
    .min(1, "Rozmiar opakowania jest wymagany")
    .max(100, "Rozmiar opakowania nie może być dłuższy niż 100 znaków"),

  availability: z.enum(["dostępny", "niedostępny", "wycofany"]).default("dostępny"),

  certification: z
    .array(z.enum(["GMP", "HACCP", "ISO", "Organic", "Vegan", "inne"]))
    .max(5, "Maksymalnie 5 certyfikatów")
    .optional(),

  researchLinks: z
    .array(z.string().url("Nieprawidłowy adres URL"))
    .max(5, "Maksymalnie 5 linków do badań")
    .optional(),

  imageUrl: z
    .string()
    .url("Nieprawidłowy adres URL obrazka")
    .optional(),
});

export type SupplementFormData = z.infer<typeof SupplementFormSchema>;

// User profile validation schema
export const UserProfileSchema = z.object({
  age: z
    .number({
      required_error: "Wiek jest wymagany",
      invalid_type_error: "Wiek musi być liczbą",
    })
    .int("Wiek musi być liczbą całkowitą")
    .refine(validateAge, "Wiek musi być między 18 a 120 lat"),

  gender: z.enum(["male", "female", "other"], {
    required_error: "Płeć jest wymagana",
  }),

  weight: z
    .number({
      required_error: "Waga jest wymagana",
      invalid_type_error: "Waga musi być liczbą",
    })
    .min(30, "Waga musi być większa niż 30kg")
    .max(300, "Waga nie może być większa niż 300kg")
    .refine(validateWeight, "Wprowadź prawidłową wagę"),

  height: z
    .number({
      required_error: "Wzrost jest wymagany",
      invalid_type_error: "Wzrost musi być liczbą",
    })
    .int("Wzrost musi być liczbą całkowitą")
    .min(100, "Wzrost musi być większy niż 100cm")
    .max(250, "Wzrost nie może być większy niż 250cm")
    .refine(validateHeight, "Wprowadź prawidłowy wzrost"),

  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"], {
    required_error: "Poziom aktywności jest wymagany",
  }),

  healthConditions: z
    .array(z.string().min(1, "Stan zdrowia nie może być pusty"))
    .max(15, "Maksymalnie 15 stanów zdrowia"),

  currentMedications: z
    .array(z.string().min(1, "Nazwa leku nie może być pusta"))
    .max(20, "Maksymalnie 20 leków"),

  allergies: z
    .array(z.string().min(1, "Alergia nie może być pusta"))
    .max(15, "Maksymalnie 15 alergii"),

  pregnant: z.boolean(),
  breastfeeding: z.boolean(),

  goals: z
    .array(z.string().min(1, "Cel nie może być pusty"))
    .max(10, "Maksymalnie 10 celów"),

  preferences: z
    .object({
      vegetarian: z.boolean().default(false),
      vegan: z.boolean().default(false),
      glutenFree: z.boolean().default(false),
      lactoseFree: z.boolean().default(false),
      organic: z.boolean().default(false),
    }),
});

export type UserProfileData = z.infer<typeof UserProfileSchema>;

// Dosage calculation validation schema
export const DosageCalculationSchema = z.object({
  userProfile: UserProfileSchema,

  supplements: z
    .array(z.object({
      id: z.string().min(1, "ID suplementu jest wymagane"),
      name: z.string().min(1, "Nazwa suplementu jest wymagana"),
      dosage: z.string().min(1, "Dawka jest wymagana"),
      frequency: z.enum(["raz_dziennie", "dwa_razy_dziennie", "trzy_razy_dziennie", "według_potrzeby"]),
      duration: z.string().min(1, "Czas trwania jest wymagany"),
    }))
    .min(1, "Wybierz co najmniej jeden suplement")
    .max(10, "Maksymalnie 10 suplementów jednocześnie"),

  calculationOptions: z.object({
    calculationType: z.enum(["basic", "advanced", "stack"]),
    includeInteractions: z.boolean().default(true),
    includeContraindications: z.boolean().default(true),
    considerHealthConditions: z.boolean().default(true),
    considerMedications: z.boolean().default(true),
    considerAge: z.boolean().default(true),
    considerWeight: z.boolean().default(true),
  }),
});

export type DosageCalculationData = z.infer<typeof DosageCalculationSchema>;

// Review validation schema (enhanced)
export const EnhancedReviewSchema = z.object({
  title: z
    .string()
    .min(5, "Tytuł musi mieć co najmniej 5 znaków")
    .max(100, "Tytuł nie może być dłuższy niż 100 znaków"),

  polishTitle: z
    .string()
    .min(5, "Polski tytuł musi mieć co najmniej 5 znaków")
    .max(100, "Polski tytuł nie może być dłuższy niż 100 znaków")
    .optional(),

  content: z
    .string()
    .min(20, "Opinia musi mieć co najmniej 20 znaków")
    .max(2000, "Opinia nie może być dłuższa niż 2000 znaków"),

  polishContent: z
    .string()
    .min(20, "Polska opinia musi mieć co najmniej 20 znaków")
    .max(2000, "Polska opinia nie może być dłuższa niż 2000 znaków")
    .optional(),

  rating: z
    .number()
    .int("Ocena musi być liczbą całkowitą")
    .min(1, "Ocena musi być co najmniej 1")
    .max(5, "Ocena nie może być większa niż 5"),

  effectiveness: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional(),

  valueForMoney: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional(),

  easeOfUse: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional(),

  pros: z
    .array(z.string().min(1, "Zaleta nie może być pusta").max(200, "Zaleta nie może być dłuższa niż 200 znaków"))
    .max(10, "Maksymalnie 10 zalet"),

  cons: z
    .array(z.string().min(1, "Wada nie może być pusta").max(200, "Wada nie może być dłuższa niż 200 znaków"))
    .max(10, "Maksymalnie 10 wad"),

  polishPros: z
    .array(z.string().min(1, "Polska zaleta nie może być pusta").max(200, "Polska zaleta nie może być dłuższa niż 200 znaków"))
    .max(10, "Maksymalnie 10 polskich zalet")
    .optional(),

  polishCons: z
    .array(z.string().min(1, "Polska wada nie może być pusta").max(200, "Polska wada nie może być dłuższa niż 200 znaków"))
    .max(10, "Maksymalnie 10 polskich wad")
    .optional(),

  dosage: z
    .string()
    .max(200, "Dawka nie może być dłuższa niż 200 znaków")
    .optional(),

  duration: z
    .string()
    .max(100, "Czas trwania nie może być dłuższy niż 100 znaków")
    .optional(),

  frequency: z.enum(["once", "daily", "weekly", "monthly", "as_needed"]).optional(),

  verifiedPurchase: z.boolean().default(false),

  sideEffects: z
    .array(z.string().min(1, "Efekt uboczny nie może być pusty").max(200, "Efekt uboczny nie może być dłuższy niż 200 znaków"))
    .max(10, "Maksymalnie 10 efektów ubocznych")
    .optional(),

  wouldRecommend: z
    .boolean()
    .optional(),

  usageContext: z
    .string()
    .max(500, "Kontekst użycia nie może być dłuższy niż 500 znaków")
    .optional(),
});

export type EnhancedReviewData = z.infer<typeof EnhancedReviewSchema>;

// Health data validation utilities
export const validateHealthCondition = (condition: string): boolean => {
  if (!condition || condition.trim().length < 2) return false;
  if (condition.length > 100) return false;
  return polishTextRegex.test(condition.trim());
};

export const validateMedication = (medication: string): boolean => {
  if (!medication || medication.trim().length < 2) return false;
  if (medication.length > 100) return false;
  return alphanumericRegex.test(medication.trim());
};

export const validateAllergy = (allergy: string): boolean => {
  if (!allergy || allergy.trim().length < 2) return false;
  if (allergy.length > 100) return false;
  return alphanumericRegex.test(allergy.trim());
};

// Supplement interaction validation
export const validateSupplementInteraction = (supplements: string[]): {
  isValid: boolean;
  warnings: string[];
  contraindications: string[];
} => {
  const warnings: string[] = [];
  const contraindications: string[] = [];

  // Example validation rules (in real app, this would be more comprehensive)
  if (supplements.includes("witamina_k") && supplements.includes("warfaryna")) {
    contraindications.push("Witamina K może osłabiać działanie warfaryny");
  }

  if (supplements.includes("żeń_szeń") && supplements.includes("kofeina")) {
    warnings.push("Żeń-szeń może nasilać działanie kofeiny");
  }

  if (supplements.includes("melatonina") && supplements.includes("dziurawiec")) {
    contraindications.push("Dziurawiec może osłabiać działanie melatoniny");
  }

  return {
    isValid: contraindications.length === 0,
    warnings,
    contraindications,
  };
};

// Real-time validation helpers
export const createRealTimeValidator = <T>(
  schema: z.ZodSchema<T>,
  onValidationChange?: (isValid: boolean, errors: Record<string, string>) => void
) => {
  return (data: Partial<T>) => {
    try {
      schema.parse(data);
      onValidationChange?.(true, {});
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          errors[path] = err.message;
        });
        onValidationChange?.(false, errors);
        return { isValid: false, errors };
      }
      onValidationChange?.(false, { general: "Błąd walidacji" });
      return { isValid: false, errors: { general: "Błąd walidacji" } };
    }
  };
};

// Form field validation with Polish localization
export const getFieldValidationMessage = (field: string, error: string): string => {
  const polishMessages: Record<string, string> = {
    "Nazwa suplementu musi mieć co najmniej 2 znaki": "Nazwa suplementu musi mieć co najmniej 2 znaki",
    "Nazwa suplementu nie może być dłuższa niż 100 znaków": "Nazwa suplementu nie może być dłuższa niż 100 znaków",
    "Nazwa może zawierać tylko litery, cyfry, spacje i myślniki": "Nazwa może zawierać tylko litery, cyfry, spacje i myślniki",
    "Opis musi mieć co najmniej 10 znaków": "Opis musi mieć co najmniej 10 znaków",
    "Opis nie może być dłuższy niż 1000 znaków": "Opis nie może być dłuższy niż 1000 znaków",
    "Kategoria jest wymagana": "Kategoria jest wymagana",
    "Marka jest wymagana": "Marka jest wymagana",
    "Wybierz prawidłową formę suplementu": "Wybierz prawidłową formę suplementu",
    "Zalecana dawka jest wymagana": "Zalecana dawka jest wymagana",
    "Nieprawidłowy format dawki": "Nieprawidłowy format dawki (np. '500mg dziennie')",
    "Wiek jest wymagany": "Wiek jest wymagany",
    "Wiek musi być liczbą": "Wiek musi być liczbą",
    "Wiek musi być między 18 a 120 lat": "Wiek musi być między 18 a 120 lat",
    "Płeć jest wymagana": "Płeć jest wymagana",
    "Waga jest wymagana": "Waga jest wymagana",
    "Waga musi być większa niż 30kg": "Waga musi być większa niż 30kg",
    "Waga nie może być większa niż 300kg": "Waga nie może być większa niż 300kg",
    "Wzrost jest wymagany": "Wzrost jest wymagany",
    "Wzrost musi być większy niż 100cm": "Wzrost musi być większy niż 100cm",
    "Wzrost nie może być większy niż 250cm": "Wzrost nie może być większy niż 250cm",
    "Poziom aktywności jest wymagany": "Poziom aktywności jest wymagany",
  };

  return polishMessages[error] || error;
};

// Schemas are already exported above