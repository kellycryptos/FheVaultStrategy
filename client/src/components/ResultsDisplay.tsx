import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Unlock, TrendingUp, Award, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ResultsDisplayProps {
  encryptedScore?: string;
  decryptedScore?: number;
  percentile?: number;
  recommendation?: string;
  category?: 'excellent' | 'good' | 'moderate' | 'poor';
  onDecrypt: () => void;
  isDecrypting?: boolean;
}

export function ResultsDisplay({
  encryptedScore,
  decryptedScore,
  percentile,
  recommendation,
  category,
  onDecrypt,
  isDecrypting = false,
}: ResultsDisplayProps) {
  const [copiedEncrypted, setCopiedEncrypted] = useState(false);

  const handleCopyEncrypted = async () => {
    if (encryptedScore) {
      await navigator.clipboard.writeText(encryptedScore);
      setCopiedEncrypted(true);
      setTimeout(() => setCopiedEncrypted(false), 2000);
    }
  };

  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
      case 'poor': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case 'excellent': return { label: 'Excellent', variant: 'default' as const };
      case 'good': return { label: 'Good', variant: 'secondary' as const };
      case 'moderate': return { label: 'Moderate', variant: 'secondary' as const };
      case 'poor': return { label: 'Needs Work', variant: 'destructive' as const };
      default: return null;
    }
  };

  if (!encryptedScore && decryptedScore === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-muted-foreground" />
            Performance Results
          </CardTitle>
          <CardDescription>
            Results will appear here after computation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center space-y-2">
              <TrendingUp className="h-12 w-12 mx-auto opacity-50" />
              <p className="text-sm">Submit a strategy to see results...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Encrypted Score Card */}
      {encryptedScore && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-5 w-5 text-primary" />
              Encrypted Performance Score
            </CardTitle>
            <CardDescription>
              Score computed on-chain using FHE
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Encrypted Data
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyEncrypted}
                  className="h-7 gap-1 text-xs"
                  data-testid="button-copy-encrypted"
                >
                  {copiedEncrypted ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-muted rounded-md p-3 max-h-32 overflow-auto">
                <code className="text-xs font-mono break-all" data-testid="text-encrypted-score">
                  {encryptedScore}
                </code>
              </div>
            </div>

            {decryptedScore === undefined && (
              <Button
                onClick={onDecrypt}
                disabled={isDecrypting}
                className="w-full"
                data-testid="button-decrypt"
              >
                {isDecrypting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Decrypting...
                  </>
                ) : (
                  <>
                    <Unlock className="mr-2 h-4 w-4" />
                    Decrypt Score Locally
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Decrypted Score Card */}
      {decryptedScore !== undefined && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Unlock className="h-5 w-5 text-primary" />
                Decrypted Results
              </CardTitle>
              {category && getCategoryBadge(category) && (
                <Badge variant={getCategoryBadge(category)!.variant} data-testid="badge-category">
                  {getCategoryBadge(category)!.label}
                </Badge>
              )}
            </div>
            <CardDescription>
              Score decrypted with your private key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center space-y-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Strategy Performance Score
                </p>
                <p 
                  className={cn("text-6xl font-bold font-mono", getCategoryColor(category))}
                  data-testid="text-decrypted-score"
                >
                  {decryptedScore}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </p>
              </div>
              
              {percentile !== undefined && (
                <p className="text-sm text-muted-foreground">
                  Top <span className="font-semibold text-foreground" data-testid="text-percentile">{percentile}th</span> percentile
                </p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={decryptedScore} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Poor</span>
                <span>Moderate</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Recommendation */}
            {recommendation && (
              <div className="bg-muted/50 rounded-md p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Recommendation
                </p>
                <p className="text-sm leading-relaxed" data-testid="text-recommendation">
                  {recommendation}
                </p>
              </div>
            )}

            {/* Privacy Note */}
            <div className="pt-4 border-t space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                🔒 Privacy Guaranteed
              </p>
              <p className="text-xs text-muted-foreground">
                Your strategy parameters remain encrypted on-chain. Only you can decrypt the results with your private key.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
