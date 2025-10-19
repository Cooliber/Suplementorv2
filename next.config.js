/**
 * Next.js 15.3.3 Configuration for Suplementor Polish Educational Platform
 * Optimized for nootropics education, 3D brain visualization, and Polish localization
 */
import "./src/env.js";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

/** @type {import("next").NextConfig} */
const config = {
	// Fix workspace root detection and lockfile warnings
	outputFileTracingRoot: "src",
	// Next.js 15 App Router optimizations
	experimental: {
		// Optimize package imports for better tree shaking
		optimizePackageImports: [
			// 3D visualization libraries
			"@react-three/fiber",
			"@react-three/drei",
			"three",
			// Animation libraries
			"framer-motion",
			// UI and styling
			"lucide-react",
			"@radix-ui/react-icons",
			"@radix-ui/react-slot",
			"@radix-ui/react-dialog",
			"@radix-ui/react-dropdown-menu",
			"@radix-ui/react-tabs",
			// Utility libraries
			"clsx",
			"tailwind-merge",
			"class-variance-authority",
			// Polish localization
			"date-fns/locale/pl",
		],

		// Optimize for Polish educational content
		optimizeCss: true,

		// Medical app specific optimizations
		// Enable partial prerendering for better performance
		ppr: false, // Disabled for now, can be enabled when stable

		// Optimize server components for medical data
		serverComponentsExternalPackages: [],

		// Enable modern bundling optimizations
		optimizeServerReact: true,
	},

	// Enhanced image optimization for medical app
	images: {
		// Modern formats for better compression
		formats: ["image/avif", "image/webp"],
		// Optimized device sizes for medical content
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 768],
		// Trusted domains for medical imagery
		domains: [
			"images.unsplash.com",
			"cdn.suplementor.pl",
			"assets.suplementor.pl",
			"cdn.jsdelivr.net",
			"raw.githubusercontent.com",
			"via.placeholder.com",
		],
		// Allow SVG for medical diagrams and icons
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		// Enhanced optimization settings
		minimumCacheTTL: 60, // 1 minute minimum cache
		// Enable remote patterns for medical content
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "cdn.suplementor.pl",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "assets.suplementor.pl",
				pathname: "/**",
			},
		],
		// Unoptimized images for medical diagrams that need precision
		unoptimized: false,
	},

	// Static generation optimizations for Netlify
	generateEtags: false,

	// Bundle optimization for 3D libraries and Polish content
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		// Optimize Three.js and WebGL libraries
		config.externals.push({
			"utf-8-validate": "commonjs utf-8-validate",
			bufferutil: "commonjs bufferutil",
		});

		// Polish character encoding optimization
		config.module.rules.push({
			test: /\.(woff|woff2|eot|ttf|otf)$/,
			use: {
				loader: "file-loader",
				options: {
					publicPath: "/_next/static/fonts/",
					outputPath: "static/fonts/",
				},
			},
		});

		// Optimize for 3D model loading
		config.module.rules.push({
			test: /\.(glb|gltf|obj|fbx)$/,
			use: {
				loader: "file-loader",
				options: {
					publicPath: "/_next/static/models/",
					outputPath: "static/models/",
				},
			},
		});

		// Enhanced code splitting for medical app
		config.optimization = {
			...config.optimization,
			splitChunks: {
				chunks: "all",
				cacheGroups: {
					// Critical medical data chunk - loaded first
					medical: {
						test: /src[\\/](data|lib[\\/]services)[\\/]/,
						name: "medical-data",
						chunks: "all",
						priority: 20,
						minSize: 30000, // 30KB for medical data
						enforce: true,
					},
					// 3D visualization chunk - lazy loaded
					three: {
						test: /[\\/]node_modules[\\/](three|@react-three|react-force-graph)/,
						name: "three-vendor",
						chunks: "all",
						priority: 15,
						minSize: 100000, // 100KB for 3D libraries
					},
					// UI framework chunk
					ui: {
						test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|framer-motion)/,
						name: "ui-vendor",
						chunks: "all",
						priority: 12,
						minSize: 50000, // 50KB for UI libraries
					},
					// Large supplement database chunk
					supplements: {
						test: /src[\\/]data[\\/]supplements[\\/]/,
						name: "supplements-data",
						chunks: "all",
						priority: 10,
						minSize: 80000, // 80KB for supplement data
					},
					// Polish localization chunk
					localization: {
						test: /src[\\/](lib[\\/]localization|locales)[\\/]/,
						name: "localization",
						chunks: "all",
						priority: 8,
						minSize: 20000, // 20KB for localization
					},
					// Common vendor chunk
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendors",
						chunks: "all",
						priority: 5,
						minSize: 30000, // 30KB minimum
					},
					// Default chunk for smaller modules
					default: {
						minChunks: 2,
						priority: -20,
						reuseExistingChunk: true,
					},
				},
			},
			// Enable module concatenation for better tree shaking
			concatenateModules: true,
			// Optimize chunk size distribution
			chunkIds: "deterministic",
			moduleIds: "deterministic",
		};

		// Polish language pack optimization
		config.resolve.alias = {
			...config.resolve.alias,
			"@": "./src",
			"~": "./src",
		};

		return config;
	},

	// Headers for security and performance
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Content-Security-Policy",
						value:
							"default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; worker-src 'self' blob:;",
					},
				],
			},
			{
				source: "/api/(.*)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=300, s-maxage=300",
					},
				],
			},
			{
				source: "/_next/static/(.*)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},

	// Redirects for Polish SEO optimization
	async redirects() {
		return [
			{
				source: "/supplements",
				destination: "/suplementy",
				permanent: true,
			},
			{
				source: "/brain",
				destination: "/wiedza",
				permanent: true,
			},
			{
				source: "/knowledge",
				destination: "/wiedza",
				permanent: true,
			},
		];
	},

	// Environment-specific configurations
	env: {
		NEXT_PUBLIC_APP_NAME: "Suplementor",
		NEXT_PUBLIC_APP_DESCRIPTION:
			"Polska platforma edukacyjna o nootropikach i wzmacnianiu funkcji poznawczych",
		NEXT_PUBLIC_DEFAULT_LOCALE: "pl",
		NEXT_PUBLIC_SUPPORTED_LOCALES: "pl,en",
	},

	// TypeScript configuration
	typescript: {
		ignoreBuildErrors: false,
	},

	// ESLint configuration
	eslint: {
		ignoreDuringBuilds: false,
	},

	// Output configuration for Vercel deployment
	output: "standalone",

	// Vercel-specific optimizations
	generateBuildId: async () => {
		// Use a timestamp-based build ID for better cache busting
		return `build-${Date.now()}`;
	},

	// Enable modern output format for better performance
	poweredByHeader: false,
	compress: true,

	// Logging configuration
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
};

export default withBundleAnalyzer(config);
