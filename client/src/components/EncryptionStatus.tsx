import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Lock, Server, Key, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type EncryptionStep = "idle" | "encrypting" | "submitting" | "computing" | "completed";

interface EncryptionStatusProps {
  currentStep: EncryptionStep;
  encryptedHash?: string;
  strategyId?: string;
}

interface Step {
  id: EncryptionStep;
  icon: React.ElementType;
  label: string;
  description: string;
}

const steps: Step[] = [
  {
    id: "encrypting",
    icon: Lock,
    label: "Local Encryption",
    description: "Encrypting strategy with FHE public key",
  },
  {
    id: "submitting",
    icon: ArrowRight,
    label: "Blockchain Submission",
    description: "Sending encrypted data to smart contract",
  },
  {
    id: "computing",
    icon: Server,
    label: "Encrypted Computation",
    description: "Smart contract computing on encrypted data",
  },
  {
    id: "completed",
    icon: Check,
    label: "Ready to Decrypt",
    description: "Encrypted score ready for local decryption",
  },
];

export function EncryptionStatus({ currentStep, encryptedHash, strategyId }: EncryptionStatusProps) {
  const getCurrentStepIndex = () => {
    if (currentStep === "idle") return -1;
    return steps.findIndex(s => s.id === currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepStatus = (stepIndex: number): "completed" | "active" | "pending" => {
    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "active";
    return "pending";
  };

  if (currentStep === "idle") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-muted-foreground" />
            Encryption Status
          </CardTitle>
          <CardDescription>
            Submit a strategy to begin the FHE encryption workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center space-y-2">
              <Clock className="h-12 w-12 mx-auto opacity-50" />
              <p className="text-sm">Awaiting strategy submission...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          Encryption Workflow
        </CardTitle>
        <CardDescription>
          FHE encryption and computation pipeline
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="relative">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-5 top-10 h-12 w-0.5 transition-colors",
                      status === "completed" ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
                
                {/* Step Content */}
                <div className="flex items-start gap-4">
                  {/* Icon Circle */}
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                      status === "completed" && "border-primary bg-primary text-primary-foreground",
                      status === "active" && "border-primary bg-background text-primary animate-pulse-subtle",
                      status === "pending" && "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {status === "completed" ? (
                      <Check className="h-5 w-5" data-testid={`icon-step-${step.id}-completed`} />
                    ) : (
                      <Icon className="h-5 w-5" data-testid={`icon-step-${step.id}`} />
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1 pt-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "font-medium",
                        status === "active" && "text-foreground",
                        status === "completed" && "text-foreground",
                        status === "pending" && "text-muted-foreground"
                      )}>
                        {step.label}
                      </p>
                      {status === "active" && (
                        <Badge variant="secondary" className="text-xs" data-testid={`badge-step-${step.id}-active`}>
                          In Progress
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Details */}
        {(encryptedHash || strategyId) && (
          <div className="space-y-3 pt-4 border-t">
            {encryptedHash && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Encrypted Data Hash
                </p>
                <code className="block text-xs font-mono bg-muted px-3 py-2 rounded-md break-all" data-testid="text-encrypted-hash">
                  {encryptedHash}
                </code>
              </div>
            )}
            {strategyId && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Strategy ID
                </p>
                <code className="block text-xs font-mono bg-muted px-3 py-2 rounded-md break-all" data-testid="text-strategy-id">
                  {strategyId}
                </code>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
