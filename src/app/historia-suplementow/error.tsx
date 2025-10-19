"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function ErrorPage({
error,
reset,
}: {
error: Error & { digest?: string };
reset: () => void;
}) {
	useEffect(() => {
		console.error("Historia suplementów error:", error);
	}, [error]);

	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="mx-auto max-w-2xl">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertCircle className="h-6 w-6 text-destructive" />
						<CardTitle>Wystąpił błąd</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground">
						Nie udało się załadować historii suplementów. Spróbuj ponownie lub
						wróć później.
					</p>
					{error.message && (
						<div className="rounded-md bg-muted p-3 font-mono text-sm">
							{error.message}
						</div>
					)}
					<div className="flex gap-2">
						<Button onClick={reset}>Spróbuj ponownie</Button>
						<Button
						variant="outline"
						onClick={() => {
						  window.location.href = "/";
							}}
						>
							Wróć do strony głównej
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
