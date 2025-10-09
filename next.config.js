/**
 * Next.js 15.3.3 Configuration for Suplementor Polish Educational Platform
 * Optimized for nootropics education, 3D brain visualization, and Polish localization
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
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
	},

	// Image optimization for supplement and brain imagery
	images: {
		formats: ["image/avif", "image/webp"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		domains: [
			"images.unsplash.com",
			"cdn.suplementor.pl",
			"assets.suplementor.pl",
		],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},

	// Performance optimizations
	compress: true,
	poweredByHeader: false,

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

	// Output configuration for deployment
	output: "standalone",

	// Logging configuration
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
};

export default config;
