"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle, AlertCircle, Info, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const validationMessageVariants = cva(
  "flex items-start gap-3 p-4 rounded-lg border transition-all duration-200",
  {
    variants: {
      variant: {
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
      },
      size: {
        sm: "p-2 text-sm",
        md: "p-4 text-sm",
        lg: "p-6 text-base",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "md",
    },
  }
);

const validationIconVariants = cva("h-5 w-5 flex-shrink-0 mt-0.5", {
  variants: {
    variant: {
      success: "text-green-600",
      error: "text-red-600",
      warning: "text-yellow-600",
      info: "text-blue-600",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

interface ValidationMessageProps extends VariantProps<typeof validationMessageVariants> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

const ValidationMessage = React.forwardRef<HTMLDivElement, ValidationMessageProps>(
  ({ className, variant, size, icon, title, description, children, ...props }, ref) => {
    const defaultIcons = {
      success: <CheckCircle className={validationIconVariants({ variant })} />,
      error: <AlertCircle className={validationIconVariants({ variant })} />,
      warning: <AlertTriangle className={validationIconVariants({ variant })} />,
      info: <Info className={validationIconVariants({ variant })} />,
    };

    const Icon = icon || defaultIcons[variant || "info"];

    return (
      <div
        ref={ref}
        className={cn(validationMessageVariants({ variant, size }), className)}
        {...props}
      >
        {Icon}
        <div className="flex-1 space-y-1">
          {title && <p className="font-medium">{title}</p>}
          {description && <p className="text-sm opacity-90">{description}</p>}
          {children}
        </div>
      </div>
    );
  }
);
ValidationMessage.displayName = "ValidationMessage";

interface FieldValidationIndicatorProps {
  state: "idle" | "validating" | "valid" | "invalid";
  message?: string;
  className?: string;
}

const FieldValidationIndicator = React.forwardRef<HTMLDivElement, FieldValidationIndicatorProps>(
  ({ state, message, className, ...props }, ref) => {
    const indicators = {
      idle: null,
      validating: <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />,
      valid: <CheckCircle className="h-4 w-4 text-green-500" />,
      invalid: <XCircle className="h-4 w-4 text-red-500" />,
    };

    const indicator = indicators[state];

    if (!indicator) return null;

    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
        {indicator}
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>
    );
  }
);
FieldValidationIndicator.displayName = "FieldValidationIndicator";

interface FormProgressIndicatorProps {
  completedFields: number;
  totalFields: number;
  className?: string;
}

const FormProgressIndicator = React.forwardRef<HTMLDivElement, FormProgressIndicatorProps>(
  ({ completedFields, totalFields, className, ...props }, ref) => {
    const percentage = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
    const isComplete = percentage === 100;

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Postęp wypełniania formularza
          </span>
          <div className="flex items-center gap-2">
            <Badge variant={isComplete ? "default" : "secondary"}>
              {completedFields}/{totalFields}
            </Badge>
            <span className="text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>

        <div className="relative">
          <Progress
            value={percentage}
            className={cn(
              "h-2",
              isComplete && "bg-green-100"
            )}
          />
          {isComplete && (
            <CheckCircle className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
          )}
        </div>

        {isComplete && (
          <ValidationMessage
            variant="success"
            size="sm"
            title="Formularz wypełniony"
            description="Wszystkie wymagane pola zostały wypełnione poprawnie"
          />
        )}
      </div>
    );
  }
);
FormProgressIndicator.displayName = "FormProgressIndicator";

interface ValidationSummaryCardProps {
  errors: Array<{ field: string; message: string }>;
  warnings: Array<{ field: string; message: string }>;
  className?: string;
}

const ValidationSummaryCard = React.forwardRef<HTMLDivElement, ValidationSummaryCardProps>(
  ({ errors, warnings, className, ...props }, ref) => {
    const totalIssues = errors.length + warnings.length;

    if (totalIssues === 0) {
      return (
        <ValidationMessage
          ref={ref}
          variant="success"
          className={className}
          title="Wszystko wygląda dobrze!"
          description="Nie znaleziono błędów ani ostrzeżeń w formularzu"
          {...props}
        />
      );
    }

    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">
                  Znaleziono {errors.length} błąd{errors.length > 1 ? "ów" : ""}
                </p>
                <ul className="text-sm space-y-1">
                  {errors.slice(0, 3).map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>{error.message}</span>
                    </li>
                  ))}
                  {errors.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      ...i {errors.length - 3} więcej
                    </li>
                  )}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {warnings.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">
                  {warnings.length} ostrzeżen{warnings.length > 1 ? "ia" : "ie"}
                </p>
                <ul className="text-sm space-y-1">
                  {warnings.slice(0, 2).map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600">•</span>
                      <span>{warning.message}</span>
                    </li>
                  ))}
                  {warnings.length > 2 && (
                    <li className="text-sm text-muted-foreground">
                      ...i {warnings.length - 2} więcej
                    </li>
                  )}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }
);
ValidationSummaryCard.displayName = "ValidationSummaryCard";

interface RealTimeValidationWrapperProps {
  children: React.ReactNode;
  isValidating?: boolean;
  error?: string;
  success?: string;
  className?: string;
}

const RealTimeValidationWrapper = React.forwardRef<HTMLDivElement, RealTimeValidationWrapperProps>(
  ({ children, isValidating, error, success, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <div className="relative">
          {children}
          {isValidating && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {error && (
          <ValidationMessage variant="error" size="sm" description={error} />
        )}

        {success && !error && (
          <ValidationMessage variant="success" size="sm" description={success} />
        )}
      </div>
    );
  }
);
RealTimeValidationWrapper.displayName = "RealTimeValidationWrapper";

export {
  ValidationMessage,
  FieldValidationIndicator,
  FormProgressIndicator,
  ValidationSummaryCard,
  RealTimeValidationWrapper,
  type ValidationMessageProps,
  type FieldValidationIndicatorProps,
  type FormProgressIndicatorProps,
  type ValidationSummaryCardProps,
  type RealTimeValidationWrapperProps,
};