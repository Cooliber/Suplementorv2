/**
 * Real MongoDB Atlas Connection Configuration
 * This file provides actual MongoDB Atlas connection for the Polish Supplement Education Platform
 */

import mongoose from "mongoose";

// Bun 1.3 Compatibility: Enhanced MongoDB connection with improved error handling
// and performance optimizations for the Bun runtime

interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

declare global {
	// biome-ignore lint/style/noVar: Required for Next.js global caching pattern
	var mongooseCache: MongooseCache | undefined;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
	global.mongooseCache = cached;
}

async function connectToDatabase() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const mongoUri = process.env.MONGODB_URI;
		
		if (!mongoUri) {
			throw new Error("MONGODB_URI environment variable is not defined");
		}

		console.log("🔌 Connecting to MongoDB Atlas for Supplement Education Platform...");

		cached.promise = mongoose
			.connect(mongoUri, {
				// Connection options for MongoDB Atlas
				maxPoolSize: 10, // Maintain up to 10 socket connections
				serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
				socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
				bufferCommands: false, // Disable mongoose buffering
			})
			.then((mongoose) => {
				console.log("✅ Connected to MongoDB Atlas");
				console.log(`📊 Database: ${mongoose.connection.name}`);
				return mongoose;
			})
			.catch((error) => {
				console.error("❌ MongoDB connection error:", error);
				throw error;
			});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		console.error("❌ Failed to connect to MongoDB Atlas:", e);
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
		await cached.conn.disconnect();
		cached.conn = null;
		cached.promise = null;
		console.log("🔌 Disconnected from MongoDB Atlas");
	}
}

/**
 * Check if connected to MongoDB
 */
export function isConnected(): boolean {
	return cached.conn?.connection.readyState === 1;
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
	
	const state = cached.conn?.connection.readyState ?? 0;
	return states[state as keyof typeof states] || "unknown";
}

/**
 * Health check function for MongoDB Atlas
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
		if (!isConnected() || !cached.conn) {
			return {
				status: "unhealthy",
				details: {
					connected: false,
					readyState: cached.conn?.connection.readyState ?? 0,
				},
			};
		}

		const db = cached.conn.connection.db;
		if (!db) {
			return {
				status: "unhealthy",
				details: {
					connected: false,
					readyState: cached.conn.connection.readyState,
				},
			};
		}

		const collections = await db.listCollections().toArray();
		
		return {
			status: "healthy",
			details: {
				connected: true,
				readyState: cached.conn.connection.readyState,
				host: cached.conn.connection.host,
				name: cached.conn.connection.name,
				collections: collections.length,
			},
		};
	} catch (error) {
		console.error("❌ Database health check failed:", error);
		return {
			status: "unhealthy",
			details: {
				connected: false,
				readyState: cached.conn?.connection.readyState ?? 0,
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
		if (!isConnected() || !cached.conn) {
			throw new Error("Database not connected");
		}

		const db = cached.conn.connection.db;
		if (!db) {
			throw new Error("Database connection not available");
		}
		
		// Get collection counts
		const supplements = await db.collection("supplements").countDocuments();
		const users = await db.collection("users").countDocuments().catch(() => 0);
		const trackingLogs = await db.collection("trackinglogs").countDocuments().catch(() => 0);
		const researchStudies = await db.collection("researchstudies").countDocuments().catch(() => 0);
		const brainRegions = await db.collection("brainregions").countDocuments().catch(() => 0);
		const neurotransmitters = await db.collection("neurotransmittersystems").countDocuments().catch(() => 0);

		return {
			supplements,
			users,
			trackingLogs,
			researchStudies,
			brainRegions,
			neurotransmitters,
		};
	} catch (error) {
		console.error("❌ Failed to get database stats:", error);
		// Return zeros if stats collection fails
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

/**
 * Handle connection events - these will be set up when connection is established
 */
mongoose.connection.on("error", (error) => {
	console.error("❌ MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
	console.log("🔌 MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
	console.log("🔌 MongoDB reconnected");
});
