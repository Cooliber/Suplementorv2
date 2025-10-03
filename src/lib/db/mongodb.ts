/**
 * MongoDB Connection Configuration for Polish Supplement Education Platform
 * Enhanced with monitoring, health checks, and optimized for educational data storage
 */

import mongoose from "mongoose";

interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

declare global {
	// biome-ignore lint/style/noVar: Required for Next.js global caching pattern
	var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!;
const NODE_ENV = process.env.NODE_ENV || "development";

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local",
	);
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
	global.mongoose = cached;
}

async function connectToDatabase() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		console.log(
			"🔌 Connecting to MongoDB for Supplement Education Platform...",
		);

		const opts = {
			bufferCommands: false,
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000,
			family: 4, // Use IPv4, skip trying IPv6

			// Database name for supplement education platform
			dbName: "suplementor_education",

			// Additional options for production
			...(NODE_ENV === "production" && {
				retryWrites: true,
				w: "majority" as const,
				readPreference: "primary" as const,
				compressors: ["zlib" as const],
				zlibCompressionLevel: 6 as const,
			}),
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
			console.log(
				"✅ MongoDB connected successfully to supplement education database",
			);

			// Set up connection event listeners
			mongoose.connection.on("error", (error) => {
				console.error("❌ MongoDB connection error:", error);
			});

			mongoose.connection.on("disconnected", () => {
				console.warn("⚠️ MongoDB disconnected");
			});

			mongoose.connection.on("reconnected", () => {
				console.log("🔄 MongoDB reconnected");
			});

			// Graceful shutdown
			process.on("SIGINT", async () => {
				await mongoose.connection.close();
				console.log("🛑 MongoDB connection closed through app termination");
				process.exit(0);
			});

			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		console.error("❌ Failed to connect to MongoDB:", e);
		throw e;
	}

	return cached.conn;
}

export { connectToDatabase };
export default connectToDatabase;

/**
 * Disconnect from MongoDB (useful for testing)
 */
export async function disconnectFromDatabase() {
	if (cached.conn) {
		await mongoose.disconnect();
		cached.conn = null;
		cached.promise = null;
		console.log("🔌 Disconnected from MongoDB");
	}
}

/**
 * Check if connected to MongoDB
 */
export function isConnected(): boolean {
	return mongoose.connection.readyState === 1;
}

/**
 * Get connection status
 */
export function getConnectionStatus(): string {
	const states = {
		0: "disconnected",
		1: "connected",
		2: "connecting",
		3: "disconnecting",
	};
	return (
		states[mongoose.connection.readyState as keyof typeof states] || "unknown"
	);
}

/**
 * Health check function for MongoDB connection
 */
export async function checkDBHealth(): Promise<{
	status: "healthy" | "unhealthy";
	details: {
		connected: boolean;
		readyState: number;
		host?: string;
		name?: string;
		collections?: number;
	};
}> {
	try {
		const connection = mongoose.connection;

		if (connection.readyState !== 1) {
			return {
				status: "unhealthy",
				details: {
					connected: false,
					readyState: connection.readyState,
				},
			};
		}

		// Test database operation
		if (!connection.db) {
			return {
				status: "unhealthy",
				details: {
					connected: false,
					readyState: connection.readyState,
				},
			};
		}

		await connection.db.admin().ping();

		const collections = await connection.db.listCollections().toArray();

		return {
			status: "healthy",
			details: {
				connected: true,
				readyState: connection.readyState,
				host: connection.host,
				name: connection.name,
				collections: collections.length,
			},
		};
	} catch (error) {
		return {
			status: "unhealthy",
			details: {
				connected: false,
				readyState: mongoose.connection.readyState,
			},
		};
	}
}

/**
 * Get database statistics for monitoring
 */
export async function getDBStats(): Promise<{
	supplements: number;
	users: number;
	trackingLogs: number;
	researchStudies: number;
	brainRegions: number;
	neurotransmitters: number;
}> {
	try {
		await connectToDatabase();
		const db = mongoose.connection.db;

		if (!db) {
			throw new Error("Database connection not established");
		}

		const [
			supplements,
			users,
			trackingLogs,
			researchStudies,
			brainRegions,
			neurotransmitters,
		] = await Promise.all([
			db.collection("supplements").countDocuments(),
			db.collection("users").countDocuments(),
			db.collection("supplement_tracking_logs").countDocuments(),
			db.collection("research_studies").countDocuments(),
			db.collection("brain_regions").countDocuments(),
			db.collection("neurotransmitter_systems").countDocuments(),
		]);

		return {
			supplements,
			users,
			trackingLogs,
			researchStudies,
			brainRegions,
			neurotransmitters,
		};
	} catch (error) {
		console.error("Error getting database stats:", error);
		return {
			supplements: 0,
			users: 0,
			trackingLogs: 0,
			researchStudies: 0,
			brainRegions: 0,
			neurotransmitters: 0,
		};
	}
}
