import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

/**
 * Test component to verify shadcn/ui setup is working correctly
 * This component tests various shadcn/ui components with the new CSS variables
 */
export function ShadcnTestComponent() {
	const [progress, setProgress] = React.useState(33);
	const [switchChecked, setSwitchChecked] = React.useState(false);

	React.useEffect(() => {
		const timer = setTimeout(() => setProgress(66), 500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="p-8 max-w-4xl mx-auto space-y-8">
			<Card>
				<CardHeader>
					<CardTitle>shadcn/ui Component Test</CardTitle>
					<CardDescription>
						Testing all essential shadcn/ui components with proper styling
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Button variants */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Button Variants</h3>
						<div className="flex flex-wrap gap-2">
							<Button variant="default">Default</Button>
							<Button variant="destructive">Destructive</Button>
							<Button variant="outline">Outline</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="link">Link</Button>
						</div>
					</div>

					<Separator />

					{/* Form elements */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Form Elements</h3>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="test-input">Test Input</Label>
								<Input id="test-input" placeholder="Enter test text..." />
							</div>
							<div className="space-y-2">
								<Label htmlFor="test-switch">Test Switch</Label>
								<div className="flex items-center space-x-2">
									<Switch
										id="test-switch"
										checked={switchChecked}
										onCheckedChange={setSwitchChecked}
									/>
									<span>{switchChecked ? "On" : "Off"}</span>
								</div>
							</div>
						</div>
					</div>

					<Separator />

					{/* Badge and Progress */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Status Elements</h3>
						<div className="space-y-4">
							<div className="flex flex-wrap gap-2">
								<Badge variant="default">Default Badge</Badge>
								<Badge variant="secondary">Secondary</Badge>
								<Badge variant="destructive">Destructive</Badge>
								<Badge variant="outline">Outline</Badge>
							</div>
							<div className="space-y-2">
								<Label>Progress: {progress}%</Label>
								<Progress value={progress} className="w-full" />
							</div>
						</div>
					</div>

					<Separator />

					{/* Card demo */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Card Layout</h3>
						<Card>
							<CardHeader>
								<CardTitle>Supplement Information</CardTitle>
								<CardDescription>
									This card demonstrates proper shadcn/ui styling with CSS variables
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									The shadcn/ui components are now properly configured with CSS variables
									for theming support, including light and dark mode compatibility.
								</p>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}