"use client";

import { type VariantProps, cva } from "class-variance-authority";
import { AlertCircle, CheckCircle, Eye, EyeOff, Info } from "lucide-react";
import * as React from "react";
import { useFormContext } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const validationIndicatorVariants = cva(
	"-translate-y-1/2 absolute top-1/2 right-3 h-4 w-4 transition-all duration-200",
	{
		variants: {
			state: {
				default: "text-muted-foreground",
				valid: "text-green-500",
				invalid: "text-red-500",
				info: "text-blue-500",
			},
		},
		defaultVariants: {
			state: "default",
		},
	},
);

interface ValidationIndicatorProps
	extends VariantProps<typeof validationIndicatorVariants> {
	className?: string;
}

const ValidationIndicator = React.forwardRef<
	HTMLDivElement,
	ValidationIndicatorProps
>(({ className, state, ...props }, ref) => {
	const icons = {
		default: null,
		valid: CheckCircle,
		invalid: AlertCircle,
		info: Info,
	};

	const Icon = icons[state || "default"];

	if (!Icon) return null;

	return (
		<div
			ref={ref}
			className={cn(validationIndicatorVariants({ state }), className)}
			{...props}
		>
			<Icon className="h-4 w-4" />
		</div>
	);
});
ValidationIndicator.displayName = "ValidationIndicator";

interface EnhancedInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	description?: string;
	tooltip?: string;
	showValidationIndicator?: boolean;
	successMessage?: string;
	realTimeValidation?: boolean;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
	(
		{
			className,
			type,
			label,
			description,
			tooltip,
			showValidationIndicator = true,
			successMessage,
			realTimeValidation = true,
			...props
		},
		ref,
	) => {
		const { error, invalid, isDirty, isTouched } = useFormField();
		const [showPassword, setShowPassword] = React.useState(false);

		const getValidationState = () => {
			if (error) return "invalid";
			if (isDirty && isTouched && !invalid && props.value) return "valid";
			return "default";
		};

		const getBorderColor = () => {
			const state = getValidationState();
			switch (state) {
				case "valid":
					return "border-green-500 focus:border-green-500";
				case "invalid":
					return "border-red-500 focus:border-red-500";
				default:
					return "focus:border-primary";
			}
		};

		const isPassword = type === "password";
		const inputType = isPassword && showPassword ? "text" : type;

		return (
			<div className="space-y-2">
				{label && (
					<Label
						className={cn(
							"flex items-center gap-2",
							error && "text-destructive",
						)}
					>
						{label}
						{tooltip && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<Info className="h-4 w-4 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										<p className="max-w-xs">{tooltip}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</Label>
				)}

				<div className="relative">
					<input
						type={inputType}
						className={cn(
							"flex h-10 w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
							showValidationIndicator && "pr-10",
							isPassword && "pr-20",
							getBorderColor(),
							className,
						)}
						ref={ref}
						{...props}
					/>

					{showValidationIndicator && (
						<ValidationIndicator state={getValidationState()} />
					)}

					{isPassword && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="-translate-y-1/2 absolute top-1/2 right-10 h-6 w-6 p-0 hover:bg-transparent"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<EyeOff className="h-4 w-4 text-muted-foreground" />
							) : (
								<Eye className="h-4 w-4 text-muted-foreground" />
							)}
						</Button>
					)}
				</div>

				{description && (
					<p className="text-muted-foreground text-sm">{description}</p>
				)}

				{error && (
					<div className="flex items-center gap-2 text-destructive text-sm">
						<AlertCircle className="h-4 w-4" />
						<span>{error.message}</span>
					</div>
				)}

				{!error && successMessage && getValidationState() === "valid" && (
					<div className="flex items-center gap-2 text-green-600 text-sm">
						<CheckCircle className="h-4 w-4" />
						<span>{successMessage}</span>
					</div>
				)}
			</div>
		);
	},
);
EnhancedInput.displayName = "EnhancedInput";

interface EnhancedTextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	description?: string;
	tooltip?: string;
	showValidationIndicator?: boolean;
	successMessage?: string;
	realTimeValidation?: boolean;
	charLimit?: number;
}

const EnhancedTextarea = React.forwardRef<
	HTMLTextAreaElement,
	EnhancedTextareaProps
>(
	(
		{
			className,
			label,
			description,
			tooltip,
			showValidationIndicator = true,
			successMessage,
			realTimeValidation = true,
			charLimit,
			...props
		},
		ref,
	) => {
		const { error, invalid, isDirty, isTouched } = useFormField();
		const [charCount, setCharCount] = React.useState(
			props.value?.toString().length || 0,
		);

		const getValidationState = () => {
			if (error) return "invalid";
			if (isDirty && isTouched && !invalid && props.value) return "valid";
			return "default";
		};

		const getBorderColor = () => {
			const state = getValidationState();
			switch (state) {
				case "valid":
					return "border-green-500 focus:border-green-500";
				case "invalid":
					return "border-red-500 focus:border-red-500";
				default:
					return "focus:border-primary";
			}
		};

		const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setCharCount(e.target.value.length);
			props.onChange?.(e);
		};

		return (
			<div className="space-y-2">
				{label && (
					<Label
						className={cn(
							"flex items-center gap-2",
							error && "text-destructive",
						)}
					>
						{label}
						{tooltip && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<Info className="h-4 w-4 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										<p className="max-w-xs">{tooltip}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
						{charLimit && (
							<Badge variant="outline" className="ml-auto text-xs">
								{charCount}/{charLimit}
							</Badge>
						)}
					</Label>
				)}

				<div className="relative">
					<textarea
						className={cn(
							"flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
							showValidationIndicator && "pr-10",
							getBorderColor(),
							className,
						)}
						ref={ref}
						maxLength={charLimit}
						onChange={handleChange}
						{...props}
					/>

					{showValidationIndicator && (
						<ValidationIndicator state={getValidationState()} />
					)}
				</div>

				{description && (
					<p className="text-muted-foreground text-sm">{description}</p>
				)}

				{error && (
					<div className="flex items-center gap-2 text-destructive text-sm">
						<AlertCircle className="h-4 w-4" />
						<span>{error.message}</span>
					</div>
				)}

				{!error && successMessage && getValidationState() === "valid" && (
					<div className="flex items-center gap-2 text-green-600 text-sm">
						<CheckCircle className="h-4 w-4" />
						<span>{successMessage}</span>
					</div>
				)}
			</div>
		);
	},
);
EnhancedTextarea.displayName = "EnhancedTextarea";

interface EnhancedSelectProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	description?: string;
	tooltip?: string;
	placeholder?: string;
	options: Array<{ value: string; label: string; disabled?: boolean }>;
	showValidationIndicator?: boolean;
	successMessage?: string;
}

const EnhancedSelect = React.forwardRef<HTMLSelectElement, EnhancedSelectProps>(
	(
		{
			className,
			label,
			description,
			tooltip,
			placeholder = "Wybierz opcję",
			options,
			showValidationIndicator = true,
			successMessage,
			...props
		},
		ref,
	) => {
		const { error, invalid, isDirty, isTouched } = useFormField();

		const getValidationState = () => {
			if (error) return "invalid";
			if (isDirty && isTouched && !invalid && props.value) return "valid";
			return "default";
		};

		const getBorderColor = () => {
			const state = getValidationState();
			switch (state) {
				case "valid":
					return "border-green-500 focus:border-green-500";
				case "invalid":
					return "border-red-500 focus:border-red-500";
				default:
					return "focus:border-primary";
			}
		};

		return (
			<div className="space-y-2">
				{label && (
					<Label
						className={cn(
							"flex items-center gap-2",
							error && "text-destructive",
						)}
					>
						{label}
						{tooltip && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<Info className="h-4 w-4 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										<p className="max-w-xs">{tooltip}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</Label>
				)}

				<div className="relative">
					<select
						className={cn(
							"flex h-10 w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
							showValidationIndicator && "pr-10",
							getBorderColor(),
							className,
						)}
						ref={ref}
						{...props}
					>
						<option value="">{placeholder}</option>
						{options.map((option) => (
							<option
								key={option.value}
								value={option.value}
								disabled={option.disabled}
							>
								{option.label}
							</option>
						))}
					</select>

					{showValidationIndicator && (
						<ValidationIndicator state={getValidationState()} />
					)}
				</div>

				{description && (
					<p className="text-muted-foreground text-sm">{description}</p>
				)}

				{error && (
					<div className="flex items-center gap-2 text-destructive text-sm">
						<AlertCircle className="h-4 w-4" />
						<span>{error.message}</span>
					</div>
				)}

				{!error && successMessage && getValidationState() === "valid" && (
					<div className="flex items-center gap-2 text-green-600 text-sm">
						<CheckCircle className="h-4 w-4" />
						<span>{successMessage}</span>
					</div>
				)}
			</div>
		);
	},
);
EnhancedSelect.displayName = "EnhancedSelect";

interface ValidationSummaryProps {
	className?: string;
	showSuccess?: boolean;
}

const ValidationSummary = React.forwardRef<
	HTMLDivElement,
	ValidationSummaryProps
>(({ className, showSuccess = true, ...props }, ref) => {
	const { formState } = useFormContext();
	const { errors, isValid, isDirty, isSubmitting, isSubmitted } = formState;

	const errorCount = Object.keys(errors).length;
	const hasErrors = errorCount > 0;
	const isFormValid = isValid && isDirty;

	if (!hasErrors && !showSuccess) return null;

	return (
		<div ref={ref} className={cn("space-y-2", className)} {...props}>
			{hasErrors && (
				<div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3">
					<AlertCircle className="h-4 w-4 text-destructive" />
					<div className="flex-1">
						<p className="font-medium text-destructive text-sm">
							{errorCount === 1
								? "Znaleziono 1 błąd"
								: `Znaleziono ${errorCount} błędy`}
						</p>
						<p className="text-destructive/80 text-xs">
							Popraw błędy przed kontynuowaniem
						</p>
					</div>
				</div>
			)}

			{showSuccess && isFormValid && (isSubmitted || isSubmitting) && (
				<div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
					<CheckCircle className="h-4 w-4 text-green-600" />
					<div className="flex-1">
						<p className="font-medium text-green-800 text-sm">
							Wszystkie pola są poprawne
						</p>
						<p className="text-green-600 text-xs">
							Formularz jest gotowy do wysłania
						</p>
					</div>
				</div>
			)}
		</div>
	);
});
ValidationSummary.displayName = "ValidationSummary";

export {
	EnhancedInput,
	EnhancedTextarea,
	EnhancedSelect,
	ValidationIndicator,
	ValidationSummary,
	type EnhancedInputProps,
	type EnhancedTextareaProps,
	type EnhancedSelectProps,
	type ValidationSummaryProps,
};
