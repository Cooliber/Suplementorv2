"use client";
import * as React from "react";
import { HistoryEntryCard, type HistoryEntry } from "./HistoryEntryCard";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function SupplementTimeline({ entries }: { entries: HistoryEntry[] }){
  const [scale, setScale] = React.useState(1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const minY = entries.length > 0 ? Math.min(...entries.map(e=>e.eraStartYear)) : 0;
  const maxY = entries.length > 0 ? Math.max(...entries.map(e=>e.eraEndYear)) : 1;
  const span = Math.max(1, maxY - minY);

  function xPos(year: number){
    const ratio = (year - minY) / span;
    return ratio * 2000;
  }

  const handleZoomIn = () => setScale(s => Math.min(3, s + 0.2));
  const handleZoomOut = () => setScale(s => Math.max(0.5, s - 0.2));
  const handleReset = () => setScale(1);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        container.scrollLeft -= 100;
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        container.scrollLeft += 100;
        e.preventDefault();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
        e.preventDefault();
      } else if (e.key === "-" || e.key === "_") {
        handleZoomOut();
        e.preventDefault();
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Mobile: vertical list instead of horizontal timeline
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border bg-muted/50 p-3 text-center text-sm">
          Widok osi czasu dostępny na większych ekranach. Poniżej lista chronologiczna.
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-md border bg-background p-12 text-center text-muted-foreground">
        Brak wpisów do wyświetlenia
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Skala:</span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleZoomOut}
          aria-label="Pomniejsz"
        >
          -
        </Button>
        <span className="text-sm">{(scale*100).toFixed(0)}%</span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleZoomIn}
          aria-label="Powiększ"
        >
          +
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          aria-label="Resetuj widok"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <span className="ml-2 text-muted-foreground text-xs">
          Użyj strzałek ←→ do przewijania, +/- do zmiany skali
        </span>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-x-auto rounded-md border bg-background p-6 focus:outline-none focus:ring-2 focus:ring-ring"
        style={{height: 380}}
        tabIndex={0}
        role="region"
        aria-label="Oś czasu historii suplementów"
      >
        {/* Axis */}
        <div
          className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-muted"
          aria-hidden="true"
        />
        {/* Labels */}
        <div className="absolute left-0 right-0 top-[55%] flex justify-between text-muted-foreground text-xs">
          <span>{formatYear(minY)}</span>
          <span>{formatYear(maxY)}</span>
        </div>

        <div className="relative h-full" style={{ width: `${2000*scale}px` }}>
          {entries.map((e)=> (
            <div
              key={e.id}
              className="absolute"
              style={{ left: xPos(e.eraStartYear)*scale, top: 20, width: 320 }}
            >
              {/* Point */}
              <div
                className="absolute left-0 top-[140px] h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow"
                role="img"
                aria-label={`Punkt na osi czasu: ${e.polishTitle}`}
              />
              <HistoryEntryCard entry={e} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatYear(y:number){ return y<0 ? `${Math.abs(y)} p.n.e.` : `${y} n.e.`; }

