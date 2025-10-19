import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// Theme types and interfaces
export interface ColorScheme {
	primary: string;
	secondary: string;
	accent: string;
	background: string;
	surface: string;
	surfaceVariant: string;
	onPrimary: string;
	onSecondary: string;
	onBackground: string;
	onSurface: string;
	onSurfaceVariant: string;
	success: string;
	warning: string;
	error: string;
	info: string;
	border: string;
	borderVariant: string;
}

export interface TypographyScheme {
	fontFamily: string;
	fontSize: {
		xs: string;
		sm: string;
		base: string;
		lg: string;
		xl: string;
		"2xl": string;
		"3xl": string;
		"4xl": string;
	};
	fontWeight: {
		normal: number;
		medium: number;
		semibold: number;
		bold: number;
	};
	lineHeight: {
		tight: number;
		normal: number;
		relaxed: number;
	};
}

export interface Theme {
	id: string;
	name: string;
	colors: ColorScheme;
	typography: TypographyScheme;
	spacing: {
		xs: string;
		sm: string;
		md: string;
		lg: string;
		xl: string;
		"2xl": string;
	};
	borderRadius: {
		none: string;
		sm: string;
		md: string;
		lg: string;
		xl: string;
		full: string;
	};
	shadows: {
		sm: string;
		md: string;
		lg: string;
		xl: string;
		"2xl": string;
	};
}

// Predefined themes
export const lightTheme: Theme = {
	id: "light",
	name: "Jasny",
	colors: {
		primary: "#2563eb",
		secondary: "#64748b",
		accent: "#f59e0b",
		background: "#ffffff",
		surface: "#f8fafc",
		surfaceVariant: "#f1f5f9",
		onPrimary: "#ffffff",
		onSecondary: "#ffffff",
		onBackground: "#0f172a",
		onSurface: "#1e293b",
		onSurfaceVariant: "#475569",
		success: "#10b981",
		warning: "#f59e0b",
		error: "#ef4444",
		info: "#3b82f6",
		border: "#e2e8f0",
		borderVariant: "#cbd5e1",
	},
	typography: {
		fontFamily: "Inter, system-ui, -apple-system, sans-serif",
		fontSize: {
			xs: "0.75rem",
			sm: "0.875rem",
			base: "1rem",
			lg: "1.125rem",
			xl: "1.25rem",
			"2xl": "1.5rem",
			"3xl": "1.875rem",
			"4xl": "2.25rem",
		},
		fontWeight: {
			normal: 400,
			medium: 500,
			semibold: 600,
			bold: 700,
		},
		lineHeight: {
			tight: 1.25,
			normal: 1.5,
			relaxed: 1.75,
		},
	},
	spacing: {
		xs: "0.25rem",
		sm: "0.5rem",
		md: "1rem",
		lg: "1.5rem",
		xl: "2rem",
		"2xl": "3rem",
	},
	borderRadius: {
		none: "0",
		sm: "0.125rem",
		md: "0.375rem",
		lg: "0.5rem",
		xl: "0.75rem",
		full: "9999px",
	},
	shadows: {
		sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
		md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
		lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
		xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
		"2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
	},
};

export const darkTheme: Theme = {
	id: "dark",
	name: "Ciemny",
	colors: {
		primary: "#3b82f6",
		secondary: "#94a3b8",
		accent: "#fbbf24",
		background: "#0f172a",
		surface: "#1e293b",
		surfaceVariant: "#334155",
		onPrimary: "#ffffff",
		onSecondary: "#0f172a",
		onBackground: "#f8fafc",
		onSurface: "#f1f5f9",
		onSurfaceVariant: "#cbd5e1",
		success: "#22c55e",
		warning: "#fbbf24",
		error: "#f87171",
		info: "#60a5fa",
		border: "#334155",
		borderVariant: "#475569",
	},
	typography: lightTheme.typography,
	spacing: lightTheme.spacing,
	borderRadius: lightTheme.borderRadius,
	shadows: {
		sm: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
		md: "0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)",
		lg: "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)",
		xl: "0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)",
		"2xl": "0 25px 50px -12px rgb(0 0 0 / 0.5)",
	},
};

// Theme context
interface ThemeContextType {
	currentTheme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
	availableThemes: Theme[];
	systemPreference: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [systemPreference, setSystemPreference] = useState<"light" | "dark">(
		"light",
	);
	const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);
	const [availableThemes] = useState<Theme[]>([lightTheme, darkTheme]);

	// Detect system preference
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		setSystemPreference(mediaQuery.matches ? "dark" : "light");

		const handleChange = (e: MediaQueryListEvent) => {
			setSystemPreference(e.matches ? "dark" : "light");
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	// Apply theme to document
	useEffect(() => {
		const root = document.documentElement;

		// Apply color scheme
		Object.entries(currentTheme.colors).forEach(([key, value]) => {
			root.style.setProperty(`--color-${key}`, value);
		});

		// Apply typography
		root.style.setProperty("--font-family", currentTheme.typography.fontFamily);

		// Apply background and text color for theme transition
		root.style.setProperty("--background", currentTheme.colors.background);
		root.style.setProperty("--foreground", currentTheme.colors.onBackground);
	}, [currentTheme]);

	const setTheme = (theme: Theme) => {
		setCurrentTheme(theme);
		localStorage.setItem("suplementor-theme", theme.id);
	};

	const toggleTheme = () => {
		const newTheme = currentTheme.id === "light" ? darkTheme : lightTheme;
		setTheme(newTheme);
	};

	// Load saved theme or use system preference
	useEffect(() => {
		const savedTheme = localStorage.getItem("suplementor-theme");
		if (savedTheme) {
			const theme = availableThemes.find((t) => t.id === savedTheme);
			if (theme) {
				setCurrentTheme(theme);
			}
		} else {
			// Use system preference
			setCurrentTheme(systemPreference === "dark" ? darkTheme : lightTheme);
		}
	}, [systemPreference, availableThemes]);

	return (
		<ThemeContext.Provider
			value={{
				currentTheme,
				setTheme,
				toggleTheme,
				availableThemes,
				systemPreference,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}

// Hook for using theme
export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}

// Utility function to get CSS custom properties
export function getThemeCSSVariables(theme: Theme): Record<string, string> {
	return {
		"--color-primary": theme.colors.primary,
		"--color-secondary": theme.colors.secondary,
		"--color-accent": theme.colors.accent,
		"--color-background": theme.colors.background,
		"--color-surface": theme.colors.surface,
		"--color-surface-variant": theme.colors.surfaceVariant,
		"--color-on-primary": theme.colors.onPrimary,
		"--color-on-secondary": theme.colors.onSecondary,
		"--color-on-background": theme.colors.onBackground,
		"--color-on-surface": theme.colors.onSurface,
		"--color-on-surface-variant": theme.colors.onSurfaceVariant,
		"--color-success": theme.colors.success,
		"--color-warning": theme.colors.warning,
		"--color-error": theme.colors.error,
		"--color-info": theme.colors.info,
		"--color-border": theme.colors.border,
		"--color-border-variant": theme.colors.borderVariant,
		"--font-family": theme.typography.fontFamily,
		"--font-size-xs": theme.typography.fontSize.xs,
		"--font-size-sm": theme.typography.fontSize.sm,
		"--font-size-base": theme.typography.fontSize.base,
		"--font-size-lg": theme.typography.fontSize.lg,
		"--font-size-xl": theme.typography.fontSize.xl,
		"--font-size-2xl": theme.typography.fontSize["2xl"],
		"--font-size-3xl": theme.typography.fontSize["3xl"],
		"--font-size-4xl": theme.typography.fontSize["4xl"],
		"--spacing-xs": theme.spacing.xs,
		"--spacing-sm": theme.spacing.sm,
		"--spacing-md": theme.spacing.md,
		"--spacing-lg": theme.spacing.lg,
		"--spacing-xl": theme.spacing.xl,
		"--spacing-2xl": theme.spacing["2xl"],
		"--border-radius-sm": theme.borderRadius.sm,
		"--border-radius-md": theme.borderRadius.md,
		"--border-radius-lg": theme.borderRadius.lg,
		"--border-radius-xl": theme.borderRadius.xl,
		"--border-radius-full": theme.borderRadius.full,
		"--shadow-sm": theme.shadows.sm,
		"--shadow-md": theme.shadows.md,
		"--shadow-lg": theme.shadows.lg,
		"--shadow-xl": theme.shadows.xl,
		"--shadow-2xl": theme.shadows["2xl"],
	};
}
