import { usePolishLocalization } from "@/lib/hooks/use-polish-localization";
import { cn } from "@/lib/utils";
// PolishTestComponent.tsx
import type React from "react";

export interface PolishTestComponentProps {
	className?: string;
	children?: React.ReactNode;
}

export function PolishTestComponent({
	className,
	children,
	...props
}: PolishTestComponentProps) {
	const { t } = usePolishLocalization();

	return (
		<div className={cn("component-base-styles", className)} {...props}>
			{t("polishtestcomponent.title", "PolishTestComponent Component")}
			{children}
		</div>
	);
}

export default PolishTestComponent;
