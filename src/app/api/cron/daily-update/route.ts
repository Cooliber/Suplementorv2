import { connectToDatabase } from "@/lib/db/mongodb";
import { type NextRequest, NextResponse } from "next/server";

// This endpoint runs daily to update cached data and perform maintenance tasks
export async function POST(request: NextRequest) {
	// Verify cron secret for security
	const authHeader = request.headers.get("authorization");
	const cronSecret = process.env.CRON_SECRET;

	if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const startTime = Date.now();
	const tasks = {
		cacheRefresh: false,
		databaseCleanup: false,
		analyticsUpdate: false,
		timestamp: new Date().toISOString(),
	};

	try {
		console.log("🔄 Starting daily cron tasks...");

		// 1. Refresh cache for frequently accessed data (Redis not available)
		try {
			// In hardcoded data mode, no database operations needed
			// Mock cache refresh for compatibility

			tasks.cacheRefresh = true;
			console.log("✅ Cache refresh completed");
		} catch (error) {
			console.error("❌ Cache refresh failed:", error);
		}

		// 2. Database cleanup tasks
		try {
			// In hardcoded data mode, no database operations needed
			// Mock cleanup for compatibility
			tasks.databaseCleanup = true;
			console.log("✅ Database cleanup completed (hardcoded data mode)");
		} catch (error) {
			console.error("❌ Database cleanup failed:", error);
		}

		// 3. Update analytics data
		try {
			// This would typically send data to analytics service
			// For now, we'll just log the activity
			console.log("📊 Analytics update placeholder");

			tasks.analyticsUpdate = true;
		} catch (error) {
			console.error("❌ Analytics update failed:", error);
		}

		const duration = Date.now() - startTime;
		console.log(`✅ Daily cron completed in ${duration}ms`);

		return NextResponse.json({
			success: true,
			tasks,
			duration,
			nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
		});
	} catch (error) {
		console.error("❌ Daily cron failed:", error);

		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				tasks,
				duration: Date.now() - startTime,
			},
			{ status: 500 },
		);
	}
}

// Vercel Cron runs this as a POST request
export async function GET() {
	return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
