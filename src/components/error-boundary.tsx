"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import ErrorAlert, { ErrorInfo as AppErrorInfo, createErrorInfo } from "./ui/error-alert";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: AppErrorInfo) => void;
  showDetails?: boolean;
  allowRetry?: boolean;
  allowHome?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: AppErrorInfo | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorBoundaryInfo: AppErrorInfo = {
      type: "client",
      severity: "high",
      title: "Błąd komponentu",
      message: "Wystąpił nieoczekiwany błąd w komponencie aplikacji.",
      details: `Error: ${error.message}\nComponent Stack: ${errorInfo.componentStack}`,
      timestamp: new Date(),
      retryable: true,
    };

    this.setState({
      errorInfo: errorBoundaryInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorBoundaryInfo);
    }

    // Log error for debugging (in production, you might want to send this to an error reporting service)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">
                Coś poszło nie tak
              </CardTitle>
              <CardDescription>
                Wystąpił nieoczekiwany błąd w aplikacji. Możesz spróbować ponownie lub wrócić do strony głównej.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.errorInfo && this.props.showDetails && (
                <ErrorAlert
                  error={this.state.errorInfo}
                  compact={true}
                />
              )}

              <div className="flex gap-2 justify-center">
                {this.props.allowRetry && this.state.retryCount < this.maxRetries && (
                  <Button
                    onClick={this.handleRetry}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Spróbuj ponownie ({this.maxRetries - this.state.retryCount} pozostało)
                  </Button>
                )}

                {this.props.allowHome && (
                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                    className="flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Strona główna
                  </Button>
                )}
              </div>

              {this.state.retryCount >= this.maxRetries && (
                <p className="text-sm text-muted-foreground text-center">
                  Maksymalna liczba prób została przekroczona. Odśwież stronę lub wróć do strony głównej.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Specialized error boundaries for different parts of the app
export const SupplementErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      console.error("Supplement component error:", error);
      // Here you could send the error to an error reporting service
    }}
    showDetails={process.env.NODE_ENV === "development"}
    allowRetry={true}
    allowHome={true}
  >
    {children}
  </ErrorBoundary>
);

export const CalculatorErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      console.error("Calculator component error:", error);
    }}
    showDetails={process.env.NODE_ENV === "development"}
    allowRetry={true}
  >
    {children}
  </ErrorBoundary>
);

export const FormErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      console.error("Form component error:", error);
    }}
    showDetails={process.env.NODE_ENV === "development"}
    allowRetry={true}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;