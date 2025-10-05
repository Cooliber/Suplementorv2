import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		setupFiles: "./vitest.setup.ts",
		globals: true,
		include: ["src/**/__tests__/**/*.test.{ts,tsx}"],
		exclude: ["node_modules", "dist"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/**",
				"dist/**",
				"coverage/**",
				"vitest.config.ts",
				"vitest.setup.ts",
				"**/*.d.ts",
				"**/types/**",
				"**/types.ts",
				"**/index.ts",
				"**/__tests__/**",
			],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@/components": path.resolve(__dirname, "./src/components"),
			"@/types": path.resolve(__dirname, "./src/types"),
			"@/data": path.resolve(__dirname, "./src/data"),
			"@/lib": path.resolve(__dirname, "./src/lib"),
		},
	},
});
