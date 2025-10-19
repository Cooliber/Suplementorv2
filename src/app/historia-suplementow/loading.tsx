import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="container mx-auto space-y-6 px-4 py-8">
			<header className="space-y-2">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-5 w-96" />
			</header>

			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<Skeleton className="h-10 w-52" />
				<Skeleton className="h-10 flex-1 md:max-w-md" />
				<Skeleton className="h-5 w-32" />
			</div>

			<div
				className="rounded-md border bg-background p-6"
				style={{ height: 380 }}
			>
				<Skeleton className="h-full w-full" />
			</div>

			<section className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{Array.from({ length: 6 }).map((_, i) => (
				<Card key={`loading-card-${i}`}>
						<CardHeader>
							<div className="mb-2 flex gap-2">
								<Skeleton className="h-6 w-16" />
								<Skeleton className="h-6 w-24" />
							</div>
							<Skeleton className="h-6 w-full" />
							<Skeleton className="h-7 w-3/4" />
						</CardHeader>
						<CardContent className="space-y-3">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3" />
						</CardContent>
					</Card>
				))}
			</section>
		</div>
	);
}
