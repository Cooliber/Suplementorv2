/**
 * Root Template for Page Transitions
 * Wraps all pages with AnimatedPage for smooth transitions
 * Following Next.js 15 App Router best practices
 */

"use client";

import { AnimatedPage } from "@/components/animations";

export default function Template({ children }: { children: React.ReactNode }) {
	return <AnimatedPage>{children}</AnimatedPage>;
}
