import path from "node:path";
import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
	stories: [
		"../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
		"../src/**/*.story.@(js|jsx|mjs|ts|tsx)",
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-onboarding",
		"@storybook/addon-interactions",
		"@storybook/addon-a11y",
		"@storybook/addon-viewport",
		"@storybook/addon-backgrounds",
		"@storybook/addon-controls",
		"@storybook/addon-docs",
		"@storybook/addon-measure",
		"@storybook/addon-outline",
	],
	framework: {
		name: "@storybook/nextjs",
		options: {
			nextConfigPath: "../next.config.js",
		},
	},
	docs: {
		autodocs: "tag",
		defaultName: "Dokumentacja",
	},
	typescript: {
		check: false,
		reactDocgen: "react-docgen-typescript",
		reactDocgenTypescriptOptions: {
			shouldExtractLiteralValuesFromEnum: true,
			propFilter: (prop) =>
				prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
		},
	},
	webpackFinal: async (config) => {
		// Add path aliases to match Next.js configuration
		if (config.resolve) {
			config.resolve.alias = {
				...config.resolve.alias,
				"@": path.resolve(__dirname, "../src"),
			};
		}

		// Handle CSS modules
		const cssRule = config.module?.rules?.find((rule) => {
			if (typeof rule !== "object" || !rule) return false;
			if (rule.test?.toString().includes("css")) return true;
			return false;
		});

		if (cssRule && typeof cssRule === "object" && cssRule.use) {
			const cssLoaders = Array.isArray(cssRule.use)
				? cssRule.use
				: [cssRule.use];
			cssLoaders.forEach((loader) => {
				if (
					typeof loader === "object" &&
					loader.loader?.includes("css-loader")
				) {
					loader.options = {
						...loader.options,
						modules: {
							auto: true,
							localIdentName: "[name]__[local]--[hash:base64:5]",
						},
					};
				}
			});
		}

		// Handle SVG imports
		config.module?.rules?.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});

		return config;
	},
	staticDirs: ["../public"],
	features: {
		experimentalRSC: true,
	},
	env: (config) => ({
		...config,
		// Add environment variables for Polish localization
		NEXT_PUBLIC_DEFAULT_LOCALE: "pl",
		NEXT_PUBLIC_SUPPORTED_LOCALES: "pl,en",
	}),
};

export default config;
