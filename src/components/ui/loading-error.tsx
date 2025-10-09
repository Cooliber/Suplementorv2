"use client";

import * as React from "react";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

interface LoadingErrorProps {
  error?: string | Error;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
  title?: string;
  message?: string;
}

export function LoadingError({
  error,
  onRetry,
  isRetrying = false,
  className,
  showIcon = true,
  compact = false,
  title = "Nie udało się załadować danych",
  message,
}: LoadingErrorProps) {
  const errorMessage = message || (
    typeof error === "string"
      ? error
      : error?.message || "Wystąpił nieoczekiwany błąd podczas ładowania danych."
  );

  const getErrorIcon = () => {
    if (errorMessage.toLowerCase().includes("sieci") || errorMessage.toLowerCase().includes("połączeni")) {
      return WifiOff;
    }
    return AlertCircle;
  };

  const Icon = showIcon ? getErrorIcon() : null;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 p-3 text-sm text-muted-foreground", className)}>
        {Icon && <Icon className="h-4 w-4" />}
        <span>{errorMessage}</span>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            className="ml-auto h-6 px-2"
          >
            {isRetrying ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              "Spróbuj ponownie"
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        {Icon && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <Icon className="h-6 w-6 text-destructive" />
          </div>
        )}

        <h3 className="mb-2 text-lg font-semibold">
          {title}
        </h3>

        <p className="mb-4 text-sm text-muted-foreground max-w-md">
          {errorMessage}
        </p>

        {onRetry && (
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center gap-2"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Ładowanie...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Spróbuj ponownie
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Loading skeleton with error state
interface LoadingSkeletonProps {
  isLoading: boolean;
  error?: string | Error | null;
  onRetry?: () => void;
  isRetrying?: boolean;
  children: React.ReactNode;
  className?: string;
  skeletonCount?: number;
}

export function LoadingSkeleton({
  isLoading,
  error,
  onRetry,
  isRetrying = false,
  children,
  className,
  skeletonCount = 3,
}: LoadingSkeletonProps) {
  if (error && !isLoading) {
    return (
      <LoadingError
        error={error}
        onRetry={onRetry}
        isRetrying={isRetrying}
        className={className}
      />
    );
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return <>{children}</>;
}

// Hook for managing loading states with error handling
export function useLoadingState() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | Error | null>(null);
  const [isRetrying, setIsRetrying] = React.useState(false);

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
    setError(null);
    setIsRetrying(false);
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
    setIsRetrying(false);
  }, []);

  const setLoadingError = React.useCallback((error: string | Error) => {
    setIsLoading(false);
    setIsRetrying(false);
    setError(error);
  }, []);

  const retry = React.useCallback(() => {
    setIsRetrying(true);
    setError(null);
  }, []);

  const reset = React.useCallback(() => {
    setIsLoading(false);
    setError(null);
    setIsRetrying(false);
  }, []);

  return {
    isLoading,
    error,
    isRetrying,
    startLoading,
    stopLoading,
    setLoadingError,
    retry,
    reset,
  };
}

export default LoadingError;