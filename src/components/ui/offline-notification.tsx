"use client";

import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Wifi, WifiOff, RefreshCw, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfflineNotificationProps {
  isOnline: boolean;
  pendingChanges?: number;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  variant?: 'banner' | 'toast' | 'inline';
}

export function OfflineNotification({
  isOnline,
  pendingChanges = 0,
  onRetry,
  onDismiss,
  className,
  variant = 'banner',
}: OfflineNotificationProps) {
  const [isVisible, setIsVisible] = useState(!isOnline);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isOnline) {
      setIsVisible(true);
    } else {
      // Auto-hide when back online after a delay
      const timer = setTimeout(() => {
        setIsVisible(false);
        setRetryCount(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    onRetry?.();
  };

  if (!isVisible && isOnline) return null;

  if (variant === 'toast') {
    return (
      <div className={cn(
        "fixed top-4 right-4 z-50 max-w-sm transition-all duration-300",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        className
      )}>
        <Alert className={cn(
          "border-l-4",
          !isOnline ? "border-l-orange-500 bg-orange-50" : "border-l-green-500 bg-green-50"
        )}>
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <WifiOff className="h-4 w-4 text-orange-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className="flex-1">
              {!isOnline ? (
                <>
                  Brak połączenia z internetem
                  {pendingChanges > 0 && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {pendingChanges} oczekujących
                    </Badge>
                  )}
                </>
              ) : (
                "Połączenie przywrócone"
              )}
            </AlertDescription>
            {!isOnline && onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRetry}
                className="ml-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Spróbuj ponownie
              </Button>
            )}
            {onDismiss && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
                className="ml-1"
              >
                ✕
              </Button>
            )}
          </div>
        </Alert>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <Alert className={cn(
        "border-l-4",
        !isOnline ? "border-l-orange-500 bg-orange-50" : "border-l-green-500 bg-green-50",
        className
      )}>
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <WifiOff className="h-4 w-4 text-orange-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className="flex-1">
            {!isOnline ? (
              <>
                Jesteś w trybie offline. Dane mogą być nieaktualne.
                {pendingChanges > 0 && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {pendingChanges} oczekujących zmian
                  </Badge>
                )}
              </>
            ) : (
              "Połączenie z internetem zostało przywrócone"
            )}
          </AlertDescription>
          {!isOnline && onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleRetry}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Spróbuj ponownie
            </Button>
          )}
        </div>
      </Alert>
    );
  }

  // Default banner variant
  return (
    <div className={cn(
      "w-full transition-all duration-300",
      isVisible ? "opacity-100" : "opacity-0 h-0 overflow-hidden",
      className
    )}>
      <Alert className={cn(
        "border-l-4 border-t-0 border-r-0 border-b-0 rounded-none",
        !isOnline ? "border-l-orange-500 bg-orange-50" : "border-l-green-500 bg-green-50"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <WifiOff className="h-5 w-5 text-orange-600" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            <AlertDescription>
              {!isOnline ? (
                <div>
                  <strong>Brak połączenia z internetem</strong>
                  <p className="text-sm mt-1">
                    Pracujesz w trybie offline. Niektóre funkcje mogą być ograniczone.
                    {pendingChanges > 0 && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {pendingChanges} oczekujących zmian zostanie zsynchronizowanych po przywróceniu połączenia
                      </Badge>
                    )}
                  </p>
                </div>
              ) : (
                <div>
                  <strong>Połączenie przywrócone</strong>
                  <p className="text-sm mt-1">
                    Wszystkie dane zostały zsynchronizowane.
                  </p>
                </div>
              )}
            </AlertDescription>
          </div>
          <div className="flex items-center gap-2">
            {!isOnline && onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRetry}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Spróbuj ponownie ({retryCount})
              </Button>
            )}
            {onDismiss && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
              >
                ✕
              </Button>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
}

// Hook for using offline status in components
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}