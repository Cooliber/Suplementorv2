"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CacheStatusIndicator,
  CacheStatusDot,
  OfflineNotification,
  CacheManagement,
  SyncStatusIndicator,
  FloatingSyncIndicator,
} from "@/components/ui";
import { useCachedSupplements } from "@/hooks/use-cached-supplements";
import { useOfflineStatus } from "@/components/ui/offline-notification";
import { Database, Wifi, WifiOff } from "lucide-react";

/**
 * Example component demonstrating the caching system usage
 * This shows how to integrate all caching features in a real component
 */
export function CachingExample() {
  const { isOnline } = useOfflineStatus();

  // Example usage of cached supplements hook
  const {
    data: supplements,
    error,
    isLoading,
    cacheStatus,
    pendingChanges,
    refetch,
    refreshCache,
    clearCache,
  } = useCachedSupplements(
    { category: "nootropics", limit: 10 },
    {
      ttl: 5 * 60 * 1000, // 5 minutes
      enableOffline: true,
      enableBackgroundSync: true,
      onSync: (status) => {
        console.log("Cache status changed:", status);
      },
    }
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Caching System Example</h1>
          <p className="text-gray-600 mt-2">
            Demonstracja systemu cachowania i obsługi offline
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge className="bg-green-100 text-green-800">
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </Badge>
          ) : (
            <Badge variant="destructive">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}

          <CacheStatusDot status={cacheStatus} />
        </div>
      </div>

      {/* Offline Notification */}
      <OfflineNotification
        isOnline={isOnline}
        pendingChanges={pendingChanges}
        onRetry={refetch}
        variant="banner"
      />

      {/* Cache Status Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Status danych suplementów
          </CardTitle>
          <CardDescription>
            Aktualny status pamięci podręcznej i synchronizacji
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <CacheStatusIndicator
              status={cacheStatus}
              isOnline={isOnline}
              pendingChanges={pendingChanges}
              showDetails={true}
              onRefresh={refreshCache}
            />

            <div className="flex gap-2">
              <Button onClick={refetch} disabled={isLoading}>
                Odśwież dane
              </Button>
              <Button variant="outline" onClick={clearCache}>
                Wyczyść cache
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status synchronizacji</CardTitle>
          <CardDescription>
            Szczegółowe informacje o synchronizacji danych
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SyncStatusIndicator
            showProgress={true}
            showDetails={true}
            onSync={refetch}
          />
        </CardContent>
      </Card>

      {/* Cache Management */}
      <CacheManagement compact={false} />

      {/* Sample Data Display */}
      <Card>
        <CardHeader>
          <CardTitle>Dane suplementów</CardTitle>
          <CardDescription>
            Przykładowe dane z pamięci podręcznej
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Ładowanie danych suplementów...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-600">
              <p>Błąd: {error}</p>
            </div>
          )}

          {supplements && supplements.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-4">
                Znaleziono {supplements.length} suplementów
              </p>
              <div className="grid gap-2">
                {supplements.slice(0, 5).map((supplement: any) => (
                  <div
                    key={supplement.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{supplement.name}</div>
                      <div className="text-sm text-gray-600">
                        {supplement.category}
                      </div>
                    </div>
                    <CacheStatusDot status={cacheStatus} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {supplements && supplements.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              <p>Brak danych suplementów do wyświetlenia</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Sync Indicator */}
      <FloatingSyncIndicator />
    </div>
  );
}