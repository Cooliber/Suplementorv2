"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Atom,
  BookOpen,
  CheckCircle,
  Clock,
  ExternalLink,
  Layers,
  Link,
  Target,
  TrendingUp,
} from "lucide-react";
import type React from "react";
import { useMemo } from "react";

import { getRelatedAtoms, type KnowledgeAtom } from "@/data/atoms/knowledge-base";

interface KnowledgeAtomProps {
  atom: KnowledgeAtom;
  depth?: number;
  maxDepth?: number;
  showRelated?: boolean;
  showReferences?: boolean;
  language?: "en" | "pl";
  onAtomClick?: (atom: KnowledgeAtom) => void;
  onReferenceClick?: (reference: string) => void;
  compact?: boolean;
}

const KnowledgeAtom: React.FC<KnowledgeAtomProps> = ({
  atom,
  depth = 0,
  maxDepth = 2,
  showRelated = false,
  showReferences = true,
  language = "pl",
  onAtomClick,
  onReferenceClick,
  compact = false,
}) => {
  const isTitle = language === "en" ? atom.title : atom.polishTitle;
  const isContent = language === "en" ? atom.content : atom.polishContent;
  
  const relatedAtoms = useMemo(() => {
    if (depth >= maxDepth || !showRelated) return [];
    return getRelatedAtoms(atom.id);
  }, [atom, depth, maxDepth, showRelated]);

  const getEvidenceColor = (level: KnowledgeAtom["evidenceLevel"]) => {
    switch (level) {
      case "STRONG":
        return "bg-green-100 text-green-800 border-green-200";
      case "MODERATE":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "WEAK":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "INSUFFICIENT":
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: KnowledgeAtom["type"]) => {
    switch (type) {
      case "concept":
        return <Target className="h-4 w-4" />;
      case "mechanism":
        return <Layers className="h-4 w-4" />;
      case "study":
        return <BookOpen className="h-4 w-4" />;
      case "guideline":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Atom className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "neuroscience":
        return "bg-purple-50 text-purple-700";
      case "microbiome":
        return "bg-green-50 text-green-700";
      case "mitochondria":
        return "bg-orange-50 text-orange-700";
      case "supplementation":
        return "bg-blue-50 text-blue-700";
      case "sleep":
        return "bg-indigo-50 text-indigo-700";
      case "inflammation":
        return "bg-red-50 text-red-700";
      case "chronobiology":
        return "bg-cyan-50 text-cyan-700";
      case "mental-health":
        return "bg-pink-50 text-pink-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Card className="group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {getTypeIcon(atom.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-sm leading-tight truncate">
                    {isTitle}
                  </h4>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className={getEvidenceColor(atom.evidenceLevel)}>
                        {atom.evidenceLevel}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Poziom dowodów naukowych</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {isContent}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className={`text-xs ${getCategoryColor(atom.category)}`}>
                    {atom.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(atom.lastUpdated).toLocaleDateString("pl")}
                  </div>
                </div>
                {atom.relatedAtoms.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Link className="h-3 w-3" />
                    {atom.relatedAtoms.length} powiązanych
                  </div>
                )}
              </div>
              {showReferences && atom.references.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onReferenceClick) {
                          onReferenceClick(atom.references[0]);
                        }
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Zobacz pierwsze źródło naukowe</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              {getTypeIcon(atom.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg leading-tight">
                  {isTitle}
                </CardTitle>
                <Badge variant="outline" className={getEvidenceColor(atom.evidenceLevel)}>
                  {atom.evidenceLevel}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className={`text-xs ${getCategoryColor(atom.category)}`}>
                  {atom.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(atom.lastUpdated).toLocaleDateString("pl")}
                </div>
                {atom.relatedAtoms.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Link className="h-3 w-3" />
                    {atom.relatedAtoms.length} powiązanych
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {isContent}
          </p>
        </div>

        {showReferences && atom.references.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Źródła naukowe ({atom.references.length})
              </h4>
              <div className="space-y-1">
                {atom.references.slice(0, 3).map((reference, index) => (
                  <div key={index} className="group flex items-start gap-2">
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {index + 1}.
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="text-left text-sm text-blue-600 hover:text-blue-800 hover:underline flex-1 text-left"
                          onClick={() => onReferenceClick?.(reference)}
                        >
                          {reference}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Kliknij aby otworzyć źródło</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
                {atom.references.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    i {atom.references.length - 3} więcej...
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {showRelated && relatedAtoms.length > 0 && depth < maxDepth && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Powiązane treści ({relatedAtoms.length})
              </h4>
              <div className="grid gap-2">
                {relatedAtoms.slice(0, 3).map((relatedAtom) => (
                  <KnowledgeAtom
                    key={relatedAtom.id}
                    atom={relatedAtom}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                    showRelated={false}
                    showReferences={false}
                    compact={true}
                    onAtomClick={onAtomClick}
                    onReferenceClick={onReferenceClick}
                    language={language}
                  />
                ))}
                {relatedAtoms.length > 3 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onAtomClick?.(atom)}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Więcej powiązanych ({relatedAtoms.length - 3})
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default KnowledgeAtom;
