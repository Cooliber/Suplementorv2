/**
 * Database connection for Suplementor
 * Uses MongoDB via Mongoose
 */

import { connectToDatabase } from "../lib/db/mongodb";

// Export MongoDB connection function
export const db = {
	connect: connectToDatabase,
};

// Auto-connect in development
if (process.env.NODE_ENV === "development") {
	connectToDatabase().catch(console.error);
}
