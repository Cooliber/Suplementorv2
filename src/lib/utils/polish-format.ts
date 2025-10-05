/**
 * Polish Formatting Utilities
 * Format dates, numbers, currency, and other data according to Polish conventions
 */

/**
 * Format date in Polish format (DD.MM.RRRR)
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatPolishDate(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();
	return `${day}.${month}.${year}`;
}

/**
 * Format number with Polish conventions (comma as decimal separator, space as thousands separator)
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatPolishNumber(num: number, decimals = 2): string {
	const parts = num.toFixed(decimals).split(".");
	const integerPart = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, " ") ?? "0";
	const decimalPart = parts[1];
	return decimalPart ? `${integerPart},${decimalPart}` : integerPart;
}

/**
 * Format currency in EUR with Polish conventions
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatPolishCurrency(amount: number): string {
	return `${formatPolishNumber(amount, 2)} €`;
}

/**
 * Format dosage with Polish units
 * @param amount - Dosage amount
 * @param unit - Unit (mg, g, ml, etc.)
 * @param frequency - Frequency (daily, twice daily, etc.)
 * @returns Formatted dosage string
 */
export function formatPolishDosage(
	amount: number,
	unit: string,
	frequency?: string,
): string {
	const dosage = `${formatPolishNumber(amount, 0)} ${unit}`;
	return frequency ? `${dosage} ${frequency}` : dosage;
}

/**
 * Format phone number in Polish format (+48 XXX XXX XXX)
 * @param phone - Phone number (digits only)
 * @returns Formatted phone number
 */
export function formatPolishPhone(phone: string): string {
	const cleaned = phone.replace(/\D/g, "");
	if (cleaned.length === 9) {
		return `+48 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
	}
	if (cleaned.length === 11 && cleaned.startsWith("48")) {
		return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
	}
	return phone;
}

/**
 * Format time in Polish 24-hour format (HH:MM)
 * @param date - Date to format
 * @returns Formatted time string
 */
export function formatPolishTime(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");
	return `${hours}:${minutes}`;
}

/**
 * Format datetime in Polish format (DD.MM.RRRR HH:MM)
 * @param date - Date to format
 * @returns Formatted datetime string
 */
export function formatPolishDateTime(date: Date | string): string {
	return `${formatPolishDate(date)} ${formatPolishTime(date)}`;
}

/**
 * Pluralize Polish words based on count
 * @param count - Number to check
 * @param singular - Singular form (1 suplement)
 * @param plural - Plural form (2-4 suplementy)
 * @param genitivePlural - Genitive plural form (5+ suplementów)
 * @returns Correct plural form
 */
export function pluralizePolish(
	count: number,
	singular: string,
	plural: string,
	genitivePlural: string,
): string {
	if (count === 1) return singular;
	if (
		count % 10 >= 2 &&
		count % 10 <= 4 &&
		(count % 100 < 10 || count % 100 >= 20)
	) {
		return plural;
	}
	return genitivePlural;
}

/**
 * Format supplement count with proper Polish pluralization
 * @param count - Number of supplements
 * @returns Formatted string (e.g., "5 suplementów")
 */
export function formatSupplementCount(count: number): string {
	const word = pluralizePolish(count, "suplement", "suplementy", "suplementów");
	return `${count} ${word}`;
}

/**
 * Format study count with proper Polish pluralization
 * @param count - Number of studies
 * @returns Formatted string (e.g., "3 badania")
 */
export function formatStudyCount(count: number): string {
	const word = pluralizePolish(count, "badanie", "badania", "badań");
	return `${count} ${word}`;
}

/**
 * Format percentage with Polish conventions
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPolishPercentage(value: number, decimals = 1): string {
	return `${formatPolishNumber(value, decimals)}%`;
}

/**
 * Validate Polish phone number
 * @param phone - Phone number to validate
 * @returns True if valid Polish phone number
 */
export function isValidPolishPhone(phone: string): boolean {
	const cleaned = phone.replace(/\D/g, "");
	return (
		cleaned.length === 9 || (cleaned.length === 11 && cleaned.startsWith("48"))
	);
}

/**
 * Validate Polish postal code (XX-XXX)
 * @param postalCode - Postal code to validate
 * @returns True if valid Polish postal code
 */
export function isValidPolishPostalCode(postalCode: string): boolean {
	return /^\d{2}-\d{3}$/.test(postalCode);
}

/**
 * Format Polish postal code
 * @param postalCode - Postal code (digits only)
 * @returns Formatted postal code (XX-XXX)
 */
export function formatPolishPostalCode(postalCode: string): string {
	const cleaned = postalCode.replace(/\D/g, "");
	if (cleaned.length === 5) {
		return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
	}
	return postalCode;
}
