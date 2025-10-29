import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Sparkles } from "lucide-react";

interface DemoButtonProps {
  onRunDemo: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function DemoButton({ onRunDemo, isLoading = false, disabled = false }: DemoButtonProps) {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Quick Demo
        </CardTitle>
        <CardDescription>
          See the complete FHE encryption workflow in action with a pre-configured strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onRunDemo}
          disabled={disabled || isLoading}
          size="lg"
          variant="default"
          className="w-full"
          data-testid="button-run-demo"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Running Demo...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Demo Transaction
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          The demo will automatically encrypt a sample strategy, submit it to the smart contract, 
          compute the encrypted score, and decrypt the results.
        </p>
      </CardContent>
    </Card>
  );
}
