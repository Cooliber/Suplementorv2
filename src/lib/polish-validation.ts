/**
 * Polish Localization Validation
 *
 * Validates Polish translations for supplement data and UI components
 * Ensures proper Polish characters and terminology usage
 */

const POLISH_CHARACTERS = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;
const POLISH_WORDS = [
  'suplement', 'suplementy', 'witamina', 'witaminy', 'magnez', 'wapń', 'żelazo',
  'cynk', 'jod', 'selen', 'chrom', 'miedź', 'mangan', 'molibden', 'bor',
  'kofeina', 'teanina', 'ashwagandha', 'różeńiec', 'bakopa', 'kurkuma',
  'koenzym', 'koenzymu', 'chlorella', 'spirulina', 'żeń-szeń', 'żeńszeń',
  'żeń-szenia', 'żeńszenia', 'eleuterokok', 'eleuterokoka', 'ginkgo',
  'ginkgo biloba', 'gotu kola', 'gotu koli', 'reishi', 'cordyceps',
  'lion\'s mane', 'grzyba lwia grzywa', 'rhodiola', 'różeńca', 'bacopa',
  'monnieri', 'bakopy drobnolistnej', 'omega-3', 'dha', 'epa', 'ala',
  'kwasy tłuszczowe', 'aminokwasy', 'bcaa', 'glutamina', 'kreatyna',
  'beta-alanina', 'citrulina', 'ornityna', 'tauryna', 'tyrozyna',
  'fenyloalanina', 'tryptofan', 'melatonina', 'melatoniny', 'adrenalina',
  'noradrenalina', 'dopamina', 'serotonina', 'gaba', 'acetylocholina',
  'neuroprzekaźniki', 'neuroprzekaźników', 'synapsy', 'synaps', 'neurony',
  'neuronów', 'mózg', 'mózgu', 'kora', 'korze', 'hipokamp', 'hipokampa',
  'jądra', 'jąder', 'płata', 'płatów', 'czołowy', 'skroniowy', 'ciemieniowy',
  'potyliczny', 'mózżek', 'mózżku', 'most', 'mostu', 'rdzeń', 'rdzenia',
  'kręgowego', 'nerwy', 'nerwów', 'nerwowy', 'nerwowej', 'nerwowych',
  'koncentracja', 'koncentracji', 'pamięć', 'pamięci', 'uwaga', 'uwagi',
  'energia', 'energii', 'witalność', 'witalności', 'odporność', 'odporności',
  'stres', 'stresu', 'lęk', 'lęku', 'depresja', 'depresji', 'bezsenność',
  'bezsenności', 'senność', 'senności', 'bóle głowy', 'bólów głowy',
  'zawroty', 'zawrotów', 'nudności', 'nudności', 'wymioty', 'wymiotów',
  'biegunka', 'biegunki', 'zaparcia', 'zaparć', 'uczulenia', 'uczuleń',
  'reakcje alergiczne', 'reakcji alergicznych'
];

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
}

export interface SupplementData {
  id: string;
  name: string;
  polishName: string;
  description?: string;
  benefits?: string[];
  warnings?: string[];
  category?: string;
  neuroEffects?: string[];
}

/**
 * Validates Polish localization for supplement data
 */
export function validatePolishSupplement(data: SupplementData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // Check if polishName exists and is not empty
  if (!data.polishName || data.polishName.trim().length === 0) {
    errors.push(`Brak polskiej nazwy dla suplementu ${data.name}`);
    score -= 50;
  } else {
    // Check for proper Polish characters
    if (!POLISH_CHARACTERS.test(data.polishName)) {
      warnings.push(`Nazwa "${data.polishName}" nie zawiera polskich znaków diakrytycznych`);
      score -= 10;
    }

    // Check if it's not just English name
    if (data.polishName.toLowerCase() === data.name.toLowerCase()) {
      errors.push(`Polska nazwa "${data.polishName}" jest identyczna z angielską`);
      score -= 30;
    }

    // Check for minimum meaningful length
    if (data.polishName.trim().length < 3) {
      errors.push(`Polska nazwa "${data.polishName}" jest zbyt krótka`);
      score -= 20;
    }
  }

  // Validate description if present
  if (data.description) {
    const descValidation = validatePolishText(data.description, `opis suplementu ${data.name}`);
    errors.push(...descValidation.errors);
    warnings.push(...descValidation.warnings);
    score = Math.max(0, score - (descValidation.errors.length * 5) - (descValidation.warnings.length * 2));
  }

  // Validate benefits
  if (data.benefits && data.benefits.length > 0) {
    data.benefits.forEach((benefit, index) => {
      const benefitValidation = validatePolishText(benefit, `korzyść ${index + 1} suplementu ${data.name}`);
      errors.push(...benefitValidation.errors);
      warnings.push(...benefitValidation.warnings);
      score = Math.max(0, score - (benefitValidation.errors.length * 3) - (benefitValidation.warnings.length * 1));
    });
  }

  // Validate warnings
  if (data.warnings && data.warnings.length > 0) {
    data.warnings.forEach((warning, index) => {
      const warningValidation = validatePolishText(warning, `ostrzeżenie ${index + 1} suplementu ${data.name}`);
      errors.push(...warningValidation.errors);
      warnings.push(...warningValidation.warnings);
      score = Math.max(0, score - (warningValidation.errors.length * 3) - (warningValidation.warnings.length * 1));
    });
  }

  // Validate category
  if (data.category) {
    const categoryValidation = validatePolishText(data.category, `kategoria suplementu ${data.name}`);
    errors.push(...categoryValidation.errors);
    warnings.push(...categoryValidation.warnings);
    score = Math.max(0, score - (categoryValidation.errors.length * 5) - (categoryValidation.warnings.length * 2));
  }

  // Validate neuro effects
  if (data.neuroEffects && data.neuroEffects.length > 0) {
    data.neuroEffects.forEach((effect, index) => {
      const effectValidation = validatePolishText(effect, `efekt neurologiczny ${index + 1} suplementu ${data.name}`);
      errors.push(...effectValidation.errors);
      warnings.push(...effectValidation.warnings);
      score = Math.max(0, score - (effectValidation.errors.length * 4) - (effectValidation.warnings.length * 2));
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score)
  };
}

/**
 * Validates Polish text content
 */
export function validatePolishText(text: string, context: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!text || text.trim().length === 0) {
    errors.push(`Pusty tekst w kontekście: ${context}`);
    score -= 50;
    return { isValid: false, errors, warnings, score };
  }

  // Check for Polish characters
  if (!POLISH_CHARACTERS.test(text)) {
    warnings.push(`Tekst w kontekście "${context}" nie zawiera polskich znaków diakrytycznych`);
    score -= 15;
  }

  // Check for common Polish neurobiology terms
  const hasPolishTerms = POLISH_WORDS.some(word =>
    text.toLowerCase().includes(word.toLowerCase())
  );

  if (!hasPolishTerms && text.length > 20) {
    warnings.push(`Tekst w kontekście "${context}" może nie zawierać odpowiedniej terminologii polskiej`);
    score -= 10;
  }

  // Check for minimum quality indicators
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount < 3) {
    warnings.push(`Tekst w kontekście "${context}" jest zbyt krótki (${wordCount} słów)`);
    score -= 5;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score)
  };
}

/**
 * Validates an array of supplement data
 */
export function validatePolishSupplements(supplements: SupplementData[]): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  let totalScore = 0;

  supplements.forEach(supplement => {
    const result = validatePolishSupplement(supplement);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
    totalScore += result.score;
  });

  const averageScore = supplements.length > 0 ? totalScore / supplements.length : 0;

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    score: Math.round(averageScore)
  };
}

/**
 * Generates a comprehensive validation report
 */
export function generateValidationReport(supplements: SupplementData[]): string {
  const result = validatePolishSupplements(supplements);

  let report = '# Raport Walidacji Lokalizacji Polskiej\n\n';
  report += `**Ogólny wynik:** ${result.score}/100 punktów\n\n`;
  report += `**Status:** ${result.isValid ? '✅ Poprawny' : '❌ Wymaga poprawek'}\n\n`;

  if (result.errors.length > 0) {
    report += '## Błędy (wymagają natychmiastowej poprawy)\n\n';
    result.errors.forEach((error, index) => {
      report += `${index + 1}. ${error}\n`;
    });
    report += '\n';
  }

  if (result.warnings.length > 0) {
    report += '## Ostrzeżenia (zalecane poprawy)\n\n';
    result.warnings.forEach((warning, index) => {
      report += `${index + 1}. ${warning}\n`;
    });
    report += '\n';
  }

  report += '## Statystyki\n\n';
  report += `- Łączna liczba suplementów: ${supplements.length}\n`;
  report += `- Liczba błędów: ${result.errors.length}\n`;
  report += `- Liczba ostrzeżeń: ${result.warnings.length}\n`;
  report += `- Średni wynik jakości: ${result.score}%\n\n`;

  if (result.score >= 90) {
    report += '## Wniosek\n\n';
    report += '🎉 Lokalizacja polska jest wysokiej jakości i gotowa do publikacji!\n';
  } else if (result.score >= 70) {
    report += '## Wniosek\n\n';
    report += '⚠️ Lokalizacja polska jest akceptowalna, ale wymaga drobnych poprawek.\n';
  } else {
    report += '## Wniosek\n\n';
    report += '❌ Lokalizacja polska wymaga znaczącej poprawy przed publikacją.\n';
  }

  return report;
}
