// Authentication disabled - all routes are public
import { NextResponse } from "next/server";

export const GET = () =>
	NextResponse.json({
		message: "Authentication disabled - all routes are public",
	});
export const POST = () =>
	NextResponse.json({
		message: "Authentication disabled - all routes are public",
	});
