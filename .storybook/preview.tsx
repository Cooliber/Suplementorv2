import type { Preview } from "@storybook/react";
import { themes } from "@storybook/theming";
import React from "react";
import "../src/app/globals.css";

// Polish theme configuration
const polishTheme = {
	...themes.normal,
	brandTitle: "Suplementor - Graf Wiedzy",
	brandUrl: "https://suplementor.pl",
	brandImage: "/logo-storybook.png",
	brandTarget: "_self",

	// Colors matching the Polish supplement theme
	colorPrimary: "#10b981", // Green for supplements
	colorSecondary: "#3b82f6", // Blue for neurotransmitters

	// UI colors
	appBg: "#f8fafc",
	appContentBg: "#ffffff",
	appBorderColor: "#e2e8f0",
	appBorderRadius: 8,

	// Typography
	fontBase: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
	fontCode: 'Monaco, "Fira Code", "Roboto Mono", monospace',

	// Text colors
	textColor: "#1e293b",
	textInverseColor: "#ffffff",

	// Toolbar default and active colors
	barTextColor: "#64748b",
	barSelectedColor: "#10b981",
	barBg: "#ffffff",

	// Form colors
	inputBg: "#ffffff",
	inputBorder: "#d1d5db",
	inputTextColor: "#1e293b",
	inputBorderRadius: 6,
};

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
			expanded: true,
			sort: "requiredFirst",
		},
		docs: {
			theme: polishTheme,
			toc: {
				contentsSelector: ".sbdocs-content",
				headingSelector: "h1, h2, h3",
				ignoreSelector: "#storybook-docs",
				title: "Spis treści",
				disable: false,
				unsafeTocbotOptions: {
					orderedList: false,
				},
			},
			source: {
				language: "tsx",
				format: true,
			},
		},
		backgrounds: {
			default: "light",
			values: [
				{
					name: "light",
					value: "#ffffff",
				},
				{
					name: "gray",
					value: "#f8fafc",
				},
				{
					name: "dark",
					value: "#1e293b",
				},
				{
					name: "supplement-green",
					value: "#f0fdf4",
				},
				{
					name: "neurotransmitter-blue",
					value: "#eff6ff",
				},
			],
		},
		viewport: {
			viewports: {
				mobile1: {
					name: "Mobile (320px)",
					styles: {
						width: "320px",
						height: "568px",
					},
				},
				mobile2: {
					name: "Mobile Large (414px)",
					styles: {
						width: "414px",
						height: "896px",
					},
				},
				tablet: {
					name: "Tablet (768px)",
					styles: {
						width: "768px",
						height: "1024px",
					},
				},
				desktop: {
					name: "Desktop (1024px)",
					styles: {
						width: "1024px",
						height: "768px",
					},
				},
				desktopLarge: {
					name: "Desktop Large (1440px)",
					styles: {
						width: "1440px",
						height: "900px",
					},
				},
			},
		},
		layout: "centered",
		options: {
			storySort: {
				order: [
					"Wprowadzenie",
					"Graf",
					[
						"GraphDashboard",
						"D3GraphVisualization",
						"WebGLGraphVisualization",
						"PerformanceMonitor",
						"VirtualizedNodeList",
						"ProgressiveGraphLoader",
					],
					"Komponenty",
					"Przykłady",
					"Testy",
				],
			},
		},
		// Polish localization for Storybook UI
		locale: "pl",
		locales: {
			pl: {
				title: "Polski",
				left: "🇵🇱",
			},
			en: {
				title: "English",
				left: "🇺🇸",
			},
		},
	},
	globalTypes: {
		locale: {
			description: "Język interfejsu",
			defaultValue: "pl",
			toolbar: {
				icon: "globe",
				items: [
					{ value: "pl", title: "Polski", left: "🇵🇱" },
					{ value: "en", title: "English", left: "🇺🇸" },
				],
				showName: true,
			},
		},
		theme: {
			description: "Motyw kolorystyczny",
			defaultValue: "light",
			toolbar: {
				icon: "paintbrush",
				items: [
					{ value: "light", title: "Jasny", left: "☀️" },
					{ value: "dark", title: "Ciemny", left: "🌙" },
				],
				showName: true,
			},
		},
		dataSize: {
			description: "Rozmiar danych testowych",
			defaultValue: "medium",
			toolbar: {
				icon: "database",
				items: [
					{ value: "small", title: "Mały (10 węzłów)", left: "🔸" },
					{ value: "medium", title: "Średni (50 węzłów)", left: "🔹" },
					{ value: "large", title: "Duży (200 węzłów)", left: "🔷" },
					{ value: "xlarge", title: "Bardzo duży (500 węzłów)", left: "🟦" },
				],
				showName: true,
			},
		},
		performance: {
			description: "Tryb wydajności",
			defaultValue: "normal",
			toolbar: {
				icon: "lightning",
				items: [
					{ value: "high", title: "Wysoka jakość", left: "⚡" },
					{ value: "normal", title: "Normalna", left: "🔋" },
					{ value: "low", title: "Oszczędna", left: "🪫" },
				],
				showName: true,
			},
		},
	},
	decorators: [
		(Story, context) => {
			// Apply theme class based on global theme setting
			const theme = context.globals.theme || "light";
			const themeClass = theme === "dark" ? "dark" : "";

			return (
				<div className={`storybook-wrapper ${themeClass}`}>
					<div className="font-sans antialiased">
						<Story />
					</div>
				</div>
			);
		},
	],
	tags: ["autodocs"],
};

export default preview;
